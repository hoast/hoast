// Import base class.
import BaseProcess from '@hoast/base-process'

// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import detectiveCommon from 'detective-cjs'
import detectiveModule from 'detective-es6'
import planckmatch from 'planckmatch'

// Import utility modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'
import { isClass } from '@hoast/utils/is.js'

// Promisify read file.
const fsReadFile = promisify(fs.readFile)

const REGEXP_DIRECTORY = /^(\/|.\/|..\/)/
const MATCH_OPTIONS = {
  extended: true,
  flags: 'i',
  globstar: true,
}
const READ_OPTIONS = {
  encoding: 'utf8',
}
const DETECTIVE_OPTIONS = {
  skipTypeImports: true,
}

class ProcessJavascript extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      setProperty: 'contents',
      executeProperty: 'default',
      importProperty: null,
      importPath: null,

      watchIgnore: [
        '**/node_modules/**',
      ],
    }, options)
    options = this.getOptions()

    // Convert dot notation to path segments.
    if (options.importProperty) {
      this._importPropertyPath = options.importProperty.split('.')
    }
    if (options.executeProperty) {
      this._executePropertyPath = options.executeProperty.split('.')
    }
    if (options.setProperty) {
      this._setPropertyPath = options.setProperty.split('.')
    }

    // Parse ignore patterns.
    this._watchIgnore = options.watchIgnore ? planckmatch.parse(options.watchIgnore, MATCH_OPTIONS, true) : []

    this._fileUsedByCache = {}
    this._fileUsesCache = {}
  }

  initialize () {
    const library = this.getLibrary()
    const libraryOptions = library.getOptions()
    const options = this.getOptions()

    // Construct absolute directory path.
    if (options.importPath) {
      this._importPath =
        path.isAbsolute(options.importPath)
          ? options.importPath
          : path.resolve(libraryOptions.directoryPath, options.importPath)
    }

    if (library.isWatching()) {
      // Remove changed files from dependency cache.
      const changedFiles = library.getChanged()
      if (changedFiles) {
        for (const changedFile of changedFiles) {
          if (changedFile in this._fileUsesCache) {
            delete this._fileUsesCache[changedFile]
          }
        }
      }
    }
  }

  async concurrent (data) {
    const library = this.getLibrary()
    const libraryOptions = library.getOptions()

    // Get path of script to import.
    let importPath
    try {
      importPath = getByPathSegments(data, this._importPropertyPath)
    } catch { }
    if (!importPath) {
      importPath = this._importPath
      if (!importPath) {
        this.getLogger().log('No import path given for item with source: "' + data.sourceIdentifier + '".')
        return data
      }
    } else if (!path.isAbsolute(importPath)) {
      importPath = path.resolve(importPath, libraryOptions.directoryPath)
    }

    if (library.isWatching()) {
      // Get all dependencies of script.
      const dependencies = await this.getDependencies(importPath)

      // Add import and dependencies as accessed.
      library.addAccessed(data.sourceIdentifier, importPath, ...dependencies)
    }

    // Import script at path.
    let importedScript
    try {
      importedScript = await import(importPath)
    } catch (error) {
      throw new Error('Unable to import file at path: "' + importPath + '".')
    }
    // Get function to execute.
    importedScript = getByPathSegments(importedScript, this._executePropertyPath)

    // Run imported script.
    let value
    if (typeof (importedScript) === 'function') {
      try {
        if (isClass(importedScript)) {
          importedScript = new importedScript(library, data) // eslint-disable-line new-cap
        } else {
          value = importedScript(library, data)
        }
      } catch (error) {
        throw new Error('Error while executing imported script file at path: "' + importPath + '".', error)
      }
    } else {
      throw new Error('Import function at "' + this._executePropertyPath + '" from "' + importPath + '" not of type function.')
    }

    // Write value back to data.
    if (this._setPropertyPath) {
      data = setByPathSegments(data, this._setPropertyPath, value)
    }

    return data
  }

  async getDependencies (importPath) {
    const libraryOptions = this.getLibrary().getOptions()

    const dependencies = []

    const addDependencies = async (importPath) => {
      // Try to get it from cache.
      if (this._fileUsesCache[importPath]) {
        const discoveredDependencies = this._fileUsesCache[importPath]

        const addedDependencies = []
        for (const dependency of discoveredDependencies) {
          // Add dependency to list.
          if (dependencies.indexOf(dependency) >= 0) {
            continue
          }
          dependencies.push(dependency)
          addedDependencies.push(dependency)
        }

        // Add dependencies of added dependency to list.
        for (const dependency of addedDependencies) {
          await addDependencies(dependency)
        }
        return
      }

      // Read file contents.
      let content
      try {
        content = await fsReadFile(importPath, READ_OPTIONS)
      } catch {
        throw new Error('Unable to read dependencies of file at path: "' + importPath + '".')
      }
      const discoveredDependencies = [
        ...detectiveCommon(content, DETECTIVE_OPTIONS),
        ...detectiveModule(content, DETECTIVE_OPTIONS),
      ]

      // Reset dependency cache.
      this._fileUsesCache[importPath] = []

      const addedDependencies = []
      for (let dependency of discoveredDependencies) {
        // Exclude any non file path dependencies.
        if (!REGEXP_DIRECTORY.test(dependency)) {
          continue
        }

        // Ensure dependency is an absolute path.
        if (!path.isAbsolute(dependency)) {
          dependency = path.resolve(path.dirname(importPath), dependency)
        }

        // Continue if dependency not inside the watched directory.
        if (!dependency.startsWith(libraryOptions.directoryPath)) {
          continue
        }

        // Continue if dependency should be ignored.
        if (planckmatch.match.any(dependency, this._watchIgnore)) {
          continue
        }

        // Added dependencies to cache.
        this._fileUsesCache[importPath].push(dependency)

        // Add dependency to list.
        if (dependencies.indexOf(dependency) < 0) {
          dependencies.push(dependency)
          addedDependencies.push(dependency)
        }
      }

      // Add dependencies of added dependency to the list.
      for (const dependency of addedDependencies) {
        await addDependencies(dependency)
      }
    }

    // Start adding dependencies to the list.
    await addDependencies(importPath)

    return dependencies
  }
}

export default ProcessJavascript
