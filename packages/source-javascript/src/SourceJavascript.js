// Import base module.
import BaseSource from '@hoast/base-source'

// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import detectiveCommon from 'detective-cjs'
import detectiveModule from 'detective-es6'
import planckmatch from 'planckmatch'

// Import utility modules.
import iterateDirectory from '@hoast/utils/iterateDirectory.js'
import { trimStart } from '@hoast/utils/trim.js'
import { getByPathSegments } from '@hoast/utils/get.js'
import { isClass } from '@hoast/utils/is.js'

// Promisify read file.
const fsReadFile = promisify(fs.readFile)

const REGEXP_DIRECTORY = /^(\/|.\/|..\/)/
const READ_OPTIONS = {
  encoding: 'utf8',
}
const DETECTIVE_OPTIONS = {
  skipTypeImports: true,
}

class SourceJavascript extends BaseSource {
  /**
   * Create package instance.
   * @param  {Object} options Options objects.
   */
  constructor(options) {
    super({
      directory: null,
      executeProperty: 'default',
      filterPatterns: null,
      filterOptions: {
        all: false,
      },
    }, options)
    options = this.getOptions()

    // Convert dot notation to path segments.
    if (options.executeProperty) {
      this._executePropertyPath = options.executeProperty.split('.')
    }

    // Parse patterns into regular expressions.
    if (options.filterPatterns && options.filterPatterns.length > 0) {
      this._expressions = options.filterPatterns.map(pattern => {
        return planckmatch.parse(pattern, options.filterOptions, true)
      })
    }

    this._fileUsesCache = {}
  }

  async initialize () {
    const libraryOptions = this.getLibrary().getOptions()
    const options = this.getOptions()

    // Construct absolute directory path.
    if (options.directory) {
      this._directoryPath =
        (options.directory && path.isAbsolute(options.directory))
          ? options.directory
          : path.resolve(libraryOptions.directory, options.directory)
    } else {
      this._directoryPath = libraryOptions.directory
    }

    // Create directory iterator.
    this._directoryIterator = await iterateDirectory(this._directoryPath)
  }

  async sequential () {
    const library = this.getLibrary()
    const options = this.getOptions()

    let filePath
    // Get next file path.
    while (filePath = await this._directoryIterator()) {
      if (library.isWatching()) {
        // Skip if file hasn't changed.
        if (!library.hasChanged(filePath)) {
          continue
        }
        library.clearAccessed(filePath)
      }

      // Make file path relative.
      const filePathRelative = path.relative(this._directoryPath, filePath)

      // Check if path matches the patterns.
      if (this._expressions) {
        // Skip if it does not matches.
        const matches = options.filterOptions.all ? planckmatch.match.all(filePathRelative, this._expressions) : planckmatch.match.any(filePathRelative, this._expressions)
        if (!matches) {
          continue
        }
      }

      return [filePath, filePathRelative]
    }

    this.exhausted = true
  }

  async concurrent (data) {
    // Exit early if invalid parameters.
    if (!data) {
      return
    }
    const library = this.getLibrary()

    // Deconstruct parameters.
    const [filePath, filePathRelative] = data

    if (library.isWatching()) {
      // Get all dependencies of script.
      const dependencies = await this.getDependencies(filePath)

      // Add file path and dependencies as accessed.
      library.addAccessed(filePath, ...dependencies)
    }

    // Construct URI for file.
    let uri = trimStart(filePath, path.sep)
    if (path.sep !== '/') {
      uri = uri.replace(path.sep, '/')
    }

    // Create result.
    const result = {
      path: filePathRelative,
      sourceIdentifier: filePath,
      sourceType: 'filesystem',
      uri: 'file://' + uri,
    }

    // Import script at path.
    let importedScript
    try {
      importedScript = await import(filePath)
    } catch (error) {
      throw new Error('Unable to import file at path: "' + filePath + '".')
    }
    // Get function to execute.
    importedScript = getByPathSegments(importedScript, this._executePropertyPath)

    // Run imported script.
    if (importedScript && typeof (importedScript) === 'function') {
      try {
        if (isClass(importedScript)) {
          result.contents = new importedScript(library, result) // eslint-disable-line new-cap
        } else {
          result.contents = importedScript(library, result)
        }
      } catch (error) {
        throw new Error('Error while executing imported script file at path: "' + filePath + '".', error)
      }
    } else {
      throw new Error('Import function at "' + this._executePropertyPath + '" from "' + filePath + '" not of type function.')
    }

    // Return result.
    return result
  }

  final () {
    super.final()

    this._directoryPath = null
    this._directoryIterator = null
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
        if (!dependency.startsWith(libraryOptions.directory)) {
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

export default SourceJavascript
