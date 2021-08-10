// Import base class.
import BaseProcess from '@hoast/base-process'

// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import detectiveJavascriptCommon from 'detective-cjs'
import detectiveJavascriptModule from 'detective-es6'
import detectivePostCSS from 'detective-postcss'
import detectiveTypescript from 'detective-typescript'
import planckmatch from 'planckmatch'
// Import document processors.
import createUnified from './unifiedFactories/createUnifiedMinifier.js'
// import scripts processors.
import babel from '@babel/core'
import { minify as terser } from 'terser'
// import styles processors.
import cssnano from 'cssnano'
import Postcss from 'postcss'

// Import utility modules.
import deepAssign from '@hoast/utils/deepAssign.js'
import { getByPathSegments } from '@hoast/utils/get.js'
import instantiate from '@hoast/utils/instantiate.js'
import { setByPathSegments } from '@hoast/utils/set.js'

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
const DETECTIVE_JAVASCRIPT_OPTIONS = {
  skipTypeImports: true,
}
const DETECTIVE_POSTCSS_OPTIONS = {}
const DETECTIVE_TYPESCRIPT_OPTIONS = {
  skipTypeImports: true,
  mixedImports: true,
  jsx: true,
}

class ProcessPostprocess extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      property: 'contents',
      mode: 'html',
      minify: true,

      documentPlugins: [],

      scriptMinifyOptions: {},
      scriptOptions: {},

      styleMinifyOptions: {},
      styleOptions: {},
      stylePlugins: [],

      watchIgnore: [
        '**/node_modules/**',
      ],
    }, options)
    options = this.getOptions()

    if (ProcessPostprocess.MODES.indexOf(options.mode) < 0) {
      this.getLogger().error('Unknown mode used. Mode:  "' + options.mode + '".')
    }

    // Convert dot notation to path segments.
    this._propertyPath = options.property.split('.')

    // Parse ignore patterns.
    this._watchIgnore = options.watchIgnore ? planckmatch.parse(options.watchIgnore, MATCH_OPTIONS, true) : []

    this._fileUsesCache = {}
  }

  async initialize () {
    const library = this.getLibrary()
    const options = this.getOptions()

    if (!this._scriptProcessor) {
      // Store options.
      const scriptOptions = deepAssign({}, options.scriptOptions)
      const scriptMinifyOptions = deepAssign({}, options.scriptMinifyOptions)

      // Create script processor.
      this._scriptProcessor = async (code) => {
        // Process via Babel.
        let result = await babel.transformAsync(code, scriptOptions)
        if (result.error) {
          return code
        }

        code = result.code

        // Process via Terser.
        result = await terser(code, scriptMinifyOptions)
        if (result.error) {
          return code
        }

        return result.code
      }
    }

    if (!this._styleProcessor) {
      // Setup Postcss plugins.
      let stylePlugins = options.stylePlugins ? options.stylePlugins : []
      if (stylePlugins.length >= 0) {
        // Instantiate all plugins.
        const pluginsTemp = []
        for (let plugin of stylePlugins) {
          if (Array.isArray(plugin) || typeof (plugin) === 'string') {
            plugin = await instantiate(plugin)
          }
          pluginsTemp.push(plugin)
        }
        stylePlugins = pluginsTemp
      }

      // Add Postcss minifier.
      if (options.minify) {
        stylePlugins.push(cssnano(options.styleMinifyOptions || {}))
      }

      // Setup Postcss.
      const postcss = new Postcss(stylePlugins)
      // Create style processor.
      this._styleProcessor = (code, filePath = null) => {
        const styleOptionsTemp = Object.assign({}, options.styleOptions, {
          from: filePath || undefined,
        })

        return new Promise((resolve, reject) => {
          // Process via Postcss.
          postcss.process(code, styleOptionsTemp)
            .then(result => {
              resolve(result.css)
            })
            .catch(error => {
              reject(error)
            })
        })
      }
    }

    if (!this._documentProcessor) {
      // Create document processor.
      const unified = createUnified({
        minify: options.minify,
      }, options.documentPlugins, this._styleProcessor, this._scriptProcessor)
      this._documentProcessor = async (code) => {
        return (await unified.process(code)).value
      }
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
    const options = this.getOptions()

    // Get value to process from data.
    let value = getByPathSegments(data, this._propertyPath)

    // If watching mark dependencies as accessed.
    if (library.isWatching()) {
      // Get all dependencies of script.
      const dependencies = await this.getDependencies(data.sourceIdentifier, value, options.mode)

      // Add import and dependencies as accessed.
      library.addAccessed(data.sourceIdentifier, ...dependencies)
    }

    // Process based of type.
    switch (options.mode) {
      case 'html':
        value = await this._documentProcessor(value)
        break

      case 'cjs':
      case 'js':
      case 'mjs':
      case 'ts':
        value = await this._scriptProcessor(value)
        break

      case 'css':
        let filePathTemp
        if (data.sourceType === 'filesystem') {
          filePathTemp = data.sourceIdentifier
        }
        value = await this._styleProcessor(value, filePathTemp)
        break
    }

    // Store value back on data.
    data = setByPathSegments(data, this._propertyPath, value)

    return data
  }

  async getDependencies (source, content, type) {
    /**
     * Discover dependencies of given string.
     */
    const discoverDependencies = (content, type) => {
      // Get dependencies based of type.
      switch (type) {
        case 'css':
          return detectivePostCSS(content, DETECTIVE_POSTCSS_OPTIONS)

        case 'cjs':
          return detectiveJavascriptCommon(content)

        case 'js':
          return [
            ...detectiveJavascriptCommon(content),
            ...detectiveJavascriptModule(content, DETECTIVE_JAVASCRIPT_OPTIONS),
          ]

        case 'mjs':
          return detectiveJavascriptModule(content, DETECTIVE_JAVASCRIPT_OPTIONS)

        case 'ts':
          return detectiveTypescript(content, DETECTIVE_TYPESCRIPT_OPTIONS)
      }

      return []
    }

    // Discover dependencies of given content.
    const discoveredDependencies = discoverDependencies(content, type)

    // Return early if no dependencies have been found.
    if (!discoveredDependencies || discoveredDependencies.length === 0) {
      return []
    }

    // Get library options.
    const libraryOptions = this.getLibrary().getOptions()

    // Results list of dependencies.
    const dependencies = []

    /**
     * Filter out dependencies that our outside the watcher or should be ignored.
     */
    const filterDependencies = (importPath, discoveredDependencies) => {
      if (!discoveredDependencies || discoveredDependencies.length === 0) {
        return []
      }

      const filteredDependencies = []
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

        filteredDependencies.push(dependency)
      }
      return filteredDependencies
    }

    /**
     * Add dependencies to list and add sub dependencies.
     */
    const addDependencies = async (importPath, filteredDependencies, type) => {
      const addedDependencies = []
      for (const dependency of filteredDependencies) {
        // Add dependency to list.
        if (dependencies.indexOf(dependency) < 0) {
          dependencies.push(dependency)
          addedDependencies.push(dependency)
        }
      }

      // Add dependencies of added dependency to the list.
      for (const dependency of addedDependencies) {
        // Try to get it from cache.
        if (this._fileUsesCache[dependency]) {
          await addDependencies(dependency, this._fileUsesCache[dependency])
          continue
        }

        // Read dependency's file contents.
        let content
        try {
          content = await fsReadFile(dependency, READ_OPTIONS)
        } catch {
          throw new Error('Unable to read dependencies of file at path: "' + importPath + '".')
        }

        // Get type from dependency.
        let dependencyType = dependency.replace(/\.[^/.]+$/, '')
        if (!dependencyType) {
          dependencyType = type
        }

        // Discover, filter, and add dependencies.
        const filteredDependencies = filterDependencies(dependency,
          discoverDependencies(content, dependencyType)
        )
        this._fileUsesCache[dependency] = filteredDependencies
        await addDependencies(dependency, filteredDependencies)
      }
    }

    // Recursively add dependencies of dependencies to the list.
    await addDependencies(source, filterDependencies(source, discoveredDependencies), type)

    return dependencies
  }
}

ProcessPostprocess.MODES = [
  'css',
  'cjs',
  'html',
  'js',
  'mjs',
  'ts',
]

export default ProcessPostprocess
