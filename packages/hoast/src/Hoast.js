// Import build-in modules.
import path from 'path'

// Import external modules.
import { hasProperties } from '@hoast/utils/has.js'
import deepAssign from '@hoast/utils/deepAssign.js'
import planckmatch from 'planckmatch'

// Import internal modules.
import call from './utils/call.js'
import logger from './utils/logger.js'
import _process from './utils/process.js'

const MATCH_OPTIONS = {
  extended: true,
  flags: 'i',
  globstar: true,
}

class Hoast {
  /**
   * Create Hoast instance.
   * @param {Object} options Options object.
   * @param {Object} meta Global metadata that can be picked up by process packages.
   * @returns {Object} Hoast instance.
   */
  constructor(options = {}, meta = {}) {
    // Set options.
    this._options = deepAssign({
      logLevel: 2,

      concurrencyLimit: 4,
      directoryPath: null,
    }, options)

    this._isWatching = false

    if (!this._options.directoryPath) {
      this._options.directoryPath = process.cwd()
    } else if (!path.isAbsolute(this._options.directoryPath)) {
      this._options.directoryPath = path.resolve(process.cwd, this._options.directoryPath)
    }

    // Set meta.
    this.meta = meta || {}

    // Set debugger.
    logger.setLevel(this._options.logLevel)
    logger.setPrefix(this.constructor.name)

    // Initialize meta collections.
    this._metaCollections = []

    // Initialize collections.
    this._collections = []

    // Initialize modules registry.
    this._processes = {}

    // Accessed cache.
    this._changedFiles = null
    this._accessed = {}
  }

  // Accessed.

  addAccessed (source, ...filePaths) {
    if (!this._accessed[source]) {
      this._accessed[source] = []
    }

    for (let filePath of filePaths) {
      if (!filePath) {
        return
      }

      // Ensure path is absolute.
      if (!path.isAbsolute(filePath)) {
        filePath = path.resolve(this._options.directoryPath, filePath)
      } else {
        filePath = path.resolve(filePath)
      }

      // Parse file path to regular expression.
      const filePathExpression = planckmatch.parse(filePath, MATCH_OPTIONS, true)

      if (this._accessed[source].indexOf(filePathExpression) < 0) {
        this._accessed[source].push(filePathExpression)
      }
    }
  }

  clearAccessed (source) {
    this._accessed[source] = undefined
  }

  resetAccessed () {
    this._accessed = {}
  }

  // Changed.

  getChanged () {
    if (!this.isWatching() || !this._changedFiles) {
      return null
    }
    return [...this._changedFiles]
  }

  hasChanged (source) {
    // Return true if no changed files are given.
    if (!this._changedFiles || this._changedFiles.indexOf(source) >= 0 || !this._accessed[source]) {
      return true
    }

    // Check if any of the changed files are in the accessed list.
    const filePathExpressions = this._accessed[source]
    for (const changedFile of this._changedFiles) {
      if (planckmatch.match.any(changedFile, filePathExpressions)) {
        return true
      }
    }

    return false
  }

  setChanged (filePaths = null) {
    if (!filePaths) {
      this._changedFiles = null
    }

    const absolutePaths = []
    for (let filePath of filePaths) {
      if (!path.isAbsolute(filePath)) {
        filePath = path.resolve(this._options.directoryPath, filePath)
      }
      absolutePaths.push(filePath)
    }
    this._changedFiles = absolutePaths

    return this
  }

  // Options.

  getOptions () {
    return deepAssign({}, this._options)
  }

  // Watch.

  isWatching () {
    return this._isWatching
  }

  setWatching (isWatching) {
    this._isWatching = !!isWatching
  }

  // Meta collections.

  /**
   * Add collection to meta collections.
   * @param {Object} collection Collection to add.
   * @returns {Object} The hoast instance.
   */
  addMetaCollection (collection) {
    if (!hasProperties(collection, ['source'])) {
      return this
    }

    this._metaCollections.push(collection)

    return this
  }

  /**
   * Add multiple collections to meta collections.
   * @param {Array} collections Collections to add.
   * @returns {Object} The hoast instance.
   */
  addMetaCollections (collections) {
    // Filter based on type.
    collections = collections.filter((collection) => hasProperties(collection, ['source']))
    if (!collections) {
      return this
    }

    // Add to collections.
    this._metaCollections.push(...collections)

    return this
  }

  // Collections.

  /**
   * Add collection to collections.
   * @param {Object} collection Collection to add.
   * @returns {Object} The hoast instance.
   */
  addCollection (collection) {
    if (!hasProperties(collection, ['source'])) {
      return this
    }

    this._collections.push(collection)

    return this
  }

  /**
   * Add multiple collections to collections.
   * @param {Array} collections Collections to add.
   * @returns {Object} The hoast instance.
  */
  addCollections (collections) {
    // Filter based on type.
    collections = collections.filter(collection => hasProperties(collection, ['source']))
    if (!collections) {
      return this
    }

    // Add to collections.
    this._collections.push(...collections)

    return this
  }

  // Processes.

  /**
   * Register process.
   * @param {String} name Name of process.
   * @param {Object} process Process object.
   * @returns {Object} The hoast instance.
  */
  registerProcess (name, process) {
    if (typeof (name) !== 'string') {
      return this
    }

    this._processes[name] = process

    return this
  }

  /**
   * Register multiple processes.
   * @param {Object} processes Process objects by name as key.
   * @returns {Object} The hoast instance.
   */
  registerProcesses (processes) {
    const processesFiltered = {}
    for (const name in processes) {
      if (typeof (name) !== 'string') {
        continue
      }

      if (!Object.prototype.hasOwnProperty.call(processes, name)) {
        continue
      }
      processesFiltered[name] = processes[name]
    }
    if (processesFiltered === {}) {
      return this
    }

    this._processes = Object.assign(this._processes, processesFiltered)

    return this
  }

  // Process.

  /**
   * Process collections.
   * @returns {Object} The hoast instance.
   */
  async process () {
    if (this._processes) {
      // Call set library on processes.
      await call({
        concurrencyLimit: this._options.concurrencyLimit,
      }, this._processes, 'setLibrary', this)
    }

    if (this._metaCollections.length > 0) {
      // Prepare meta collections.
      const metaCollections = this._metaCollections.map(collection => {
        // Add 'assign to meta' process at the end of each meta collection.
        collection.processes = [...collection.processes, {
          process: function (library, data) {
            library.assignMeta(data)
            return data
          },
        }]

        return collection
      })

      for (const collection of metaCollections) {
        if (collection.source.setLibrary && typeof (collection.source.setLibrary) === 'function') {
          collection.source.setLibrary(this)
        }

        // Call set library on processes.
        await call({
          concurrencyLimit: this._options.concurrencyLimit,
        }, collection.processes, 'setLibrary', this)
      }

      // Process meta collections.
      await _process(this, metaCollections)
    }

    for (const collection of this._collections) {
      if (collection.source.setLibrary && typeof (collection.source.setLibrary) === 'function') {
        collection.source.setLibrary(this)
      }

      // Call set library on processes.
      await call({
        concurrencyLimit: this._options.concurrencyLimit,
      }, collection.processes, 'setLibrary', this)
    }

    // Process collections.
    await _process(this, this._collections)

    if (this._processes) {
      // Call final on processes.
      await call({
        concurrencyLimit: this._options.concurrencyLimit,
      }, this._processes, 'final')
    }

    // Reset changed files.
    this._changedFiles = null

    return this
  }
}

export default Hoast
