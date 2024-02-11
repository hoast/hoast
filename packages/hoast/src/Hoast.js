// Import build-in modules.
import path from 'path'

// Import external modules.
import { hasProperties } from '@hoast/utils/has.js'
import deepAssign from '@hoast/utils/deepAssign.js'
import planckmatch from 'planckmatch'

// Import internal modules.
import call from './utils/call.js'
import logger from './utils/logger.js'
import processCollections from './utils/process.js'

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
  constructor(
    options = {},
    meta = {},
  ) {
    // Set options.
    this._options = deepAssign({
      logLevel: 2,

      concurrencyLimit: 4,
      directory: null,
      namespace: null,
    }, options)

    this._isWatching = false

    if (!this._options.directory) {
      this._options.directory = process.cwd()
    } else if (!path.isAbsolute(this._options.directory)) {
      this._options.directory = path.resolve(process.cwd(), this._options.directory)
    }

    // Set meta.
    this.meta = meta || {}

    // Set debugger.
    logger.setLevel(this._options.logLevel)
    logger.setPrefix(this.constructor.name)

    // Initialize meta collections.
    this._metaCollections = []
    this._assignToMetaProcess = {
      next: (data) => {
        deepAssign(this.meta, data)
      },
    }

    // Initialize collections.
    this._collections = []

    // Initialize modules registry.
    this._processes = {}

    // Accessed cache.
    this._changed = null
    this._accessed = {}

    // Keep track of process call count.
    this._processCount = 0
  }

  setOption (
    name,
    value,
  ) {
    this._options[name] = value
  }

  // Access.

  /**
   * Mark a file as accessed by the given source, this will allow the watcher to rebuild effectively.
   * @param {string} source A unique identifier of the source.
   * @param  {...string} filePaths File paths accessed by the source.
   */
  addAccessed (
    source,
    ...filePaths
  ) {
    if (!this._accessed[source]) {
      this._accessed[source] = []
    }

    for (let filePath of filePaths) {
      if (!filePath) {
        return
      }

      // Ensure path is absolute.
      if (!path.isAbsolute(filePath)) {
        filePath = path.resolve(this._options.directory, filePath)
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

  /**
   * Clears information of file paths accessed by the given source.
   * @param {string} source A unique identifier of the source.
   */
  clearAccessed (
    source,
  ) {
    this._accessed[source] = undefined
  }

  // Changes.

  /**
   * Get the list of changed file since the last build.
   * @returns {Array<string>} List of absolute file paths.
   */
  getChanged (
  ) {
    if (!this.isWatching() || !this._changed) {
      return null
    }
    return [...this._changed]
  }

  /**
   * Check whether any files that the source uses have changed.
   * @param {string} source A unique identifier of the source.
   * @returns {boolean} Whether a file the source uses has changed.
   */
  hasChanged (
    source,
  ) {
    // Return true if no changed files are given.
    if (!this._changed || this._changed.indexOf(source) >= 0 || !this._accessed[source]) {
      return true
    }

    // Check if any of the changed files are in the accessed list.
    const filePathExpressions = this._accessed[source]
    for (const changedFile of this._changed) {
      if (planckmatch.match.any(changedFile, filePathExpressions)) {
        return true
      }
    }

    return false
  }

  /**
   * Marks the given set of file paths as changed files.
   * @param {Array<string>} filePaths A list of absolute file paths.
   */
  setChanged (
    filePaths = null,
  ) {
    if (!filePaths) {
      this._changed = null
    }

    const absolutePaths = []
    for (let filePath of filePaths) {
      if (!path.isAbsolute(filePath)) {
        filePath = path.resolve(this._options.directory, filePath)
      }
      absolutePaths.push(filePath)
    }
    this._changed = absolutePaths
  }

  // Options.

  /**
   * Get the options.
   * @returns {Object} The options.
   */
  getOptions (
  ) {
    return deepAssign({}, this._options)
  }

  // Process.

  /**
   * Get the process called count.
   * @returns {string} The process called count.
   */
  getProcessCount (
  ) {
    return this._processCount
  }

  // Watching.

  /**
   * Get whether the watcher is running.
   * @returns {boolean} Whether the watcher is running.
   */
  isWatching (
  ) {
    return this._isWatching
  }

  /**
   * Set whether the watcher is running.
   * @param {boolean} isWatching Whether the watcher is running.
   */
  setWatching (
    isWatching,
  ) {
    this._isWatching = !!isWatching
  }

  // Collections.

  /**
   * Add collection to collections.
   * @param {Object} collection Collection to add.
   * @returns {Object} The hoast instance.
   */
  addCollection (
    collection,
  ) {
    if (!hasProperties(collection, ['source'])) {
      logger.warn('Tried adding a collection without a source.')
      return this
    }

    // Inform process of library.
    if (collection.source.setLibrary && typeof (collection.source.setLibrary) === 'function') {
      collection.source.setLibrary(this)
    }
    for (const process of collection.processes) {
      if (process.setLibrary && typeof (process.setLibrary) === 'function') {
        process.setLibrary(this)
      }
    }

    // Add to collections.
    this._collections.push(collection)

    return this
  }

  /**
   * Add multiple collections to collections.
   * @param {Array} collections Collections to add.
   * @returns {Object} The hoast instance.
  */
  addCollections (
    collections,
  ) {
    for (const collection of collections) {
      if (!hasProperties(collection, ['source'])) {
        logger.warn('Tried adding a collection without a source.')
        continue
      }

      // Inform process of library.
      if (collection.source.setLibrary && typeof (collection.source.setLibrary) === 'function') {
        collection.source.setLibrary(this)
      }
      for (const process of collection.processes) {
        if (process.setLibrary && typeof (process.setLibrary) === 'function') {
          process.setLibrary(this)
        }
      }

      // Add to collections.
      this._collections.push(collection)
    }

    return this
  }

  // Meta collections.

  /**
   * Add collection to meta collections.
   * @param {Object} collection Collection to add.
   * @returns {Object} The hoast instance.
   */
  addMetaCollection (
    collection,
  ) {
    if (!hasProperties(collection, ['source'])) {
      logger.warn('Tried adding a meta collection without a source.')
      return this
    }

    // Inform process of library.
    if (collection.source.setLibrary && typeof (collection.source.setLibrary) === 'function') {
      collection.source.setLibrary(this)
    }
    for (const process of collection.processes) {
      if (process.setLibrary && typeof (process.setLibrary) === 'function') {
        process.setLibrary(this)
      }
    }
    // Append assign to meta process.
    collection.processes.push(this._assignToMetaProcess)

    this._metaCollections.push(collection)

    return this
  }

  /**
   * Add multiple collections to meta collections.
   * @param {Array} collections Collections to add.
   * @returns {Object} The hoast instance.
   */
  addMetaCollections (
    collections,
  ) {
    for (const collection of collections) {
      if (!hasProperties(collection, ['source'])) {
        logger.warn('Tried adding a meta collection without a source.')
        continue
      }

      // Inform process of library.
      if (collection.source.setLibrary && typeof (collection.source.setLibrary) === 'function') {
        collection.source.setLibrary(this)
      }
      for (const process of collection.processes) {
        if (process.setLibrary && typeof (process.setLibrary) === 'function') {
          process.setLibrary(this)
        }
      }
      // Append assign to meta process.
      collection.processes.push(this._assignToMetaProcess)

      // Add to collections.
      this._metaCollections.push(collection)
    }

    return this
  }

  // Processes.

  /**
   * Register process.
   * @param {string} name Name of process.
   * @param {Object} process Process object.
   * @returns {Object} The hoast instance.
  */
  registerProcess (
    name,
    process,
  ) {
    if (typeof (name) !== 'string') {
      logger.warn('Tried registering a process without a name.')
      return this
    }

    this._processes[name] = process

    // Inform process of library.
    if (process.setLibrary && typeof (process.setLibrary) === 'function') {
      process.setLibrary(this)
    }

    return this
  }

  /**
   * Register multiple processes.
   * @param {Object} processes Process objects by name as key.
   * @returns {Object} The hoast instance.
   */
  registerProcesses (
    processes,
  ) {
    const processesFiltered = {}
    for (const name in processes) {
      if (typeof (name) !== 'string') {
        logger.warn('Tried registering a process without a name.')
        continue
      }

      if (!Object.prototype.hasOwnProperty.call(processes, name)) {
        continue
      }
      const process = processes[name]

      processesFiltered[name] = process

      // Inform process of library.
      if (process.setLibrary && typeof (process.setLibrary) === 'function') {
        process.setLibrary(this)
      }
    }
    if (Object.keys(processesFiltered).length === 0) {
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
  async process (
  ) {
    if (this._metaCollections.length > 0) {
      // Process meta collections.
      await processCollections(this, this._metaCollections)
    }

    if (this._collections.length > 0) {
      // Process collections.
      await processCollections(this, this._collections)
    }

    if (this._processes) {
      // Call final on processes.
      await call({
        concurrencyLimit: this._options.concurrencyLimit,
      }, Object.values(this._processes), 'final')
    }

    // Reset changed files.
    this._changed = null
    this._processCount++

    return this
  }
}

export default Hoast
