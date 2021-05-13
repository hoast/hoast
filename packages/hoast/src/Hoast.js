// Import build-in modules.
import path from 'path'

// Import external modules.
import { hasProperties } from '@hoast/utils/has.js'
import deepAssign from '@hoast/utils/deepAssign.js'

// Import internal modules.
import call from './utils/call.js'
import logger from './utils/logger.js'
import _process from './utils/process.js'

class Hoast {
  /**
   * Create Hoast instance.
   * @param {Object} options Options object.
   * @param {Object} meta Global metadata that can be picked up by process packages.
   * @returns {Object} Hoast instance.
   */
  constructor(options = {}, meta = {}) {
    // Set options.
    this.options = deepAssign({
      logLevel: 2,

      concurrencyLimit: 4,
      directoryPath: null,
    }, options)

    if (!this.options.directoryPath) {
      this.options.directoryPath = process.cwd()
    } else if (!path.isAbsolute(this.options.directoryPath)) {
      this.options.directoryPath = path.resolve(process.cwd, this.options.directoryPath)
    }

    // Set meta.
    this.meta = meta || {}

    // Set debugger.
    logger.setLevel(this.options.logLevel)
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
      // Call set app on processes.
      await call({
        concurrencyLimit: this.options.concurrencyLimit,
      }, this._processes, '_setApp', this)
    }

    if (this._metaCollections.length > 0) {
      // Prepare meta collections.
      const metaCollections = this._metaCollections.map(collection => {
        // Add 'assign to meta' process at the end of each meta collection.
        collection.processes = [...collection.processes, {
          process: function (app, data) {
            app.assignMeta(data)
            return data
          },
        }]

        return collection
      })

      for (const collection of metaCollections) {
        if (collection.source._setApp && typeof (collection.source._setApp) === 'function') {
          collection.source._setApp(this)
        }

        // Call set app on processes.
        await call({
          concurrencyLimit: this.options.concurrencyLimit,
        }, collection.processes, '_setApp', this)
      }

      // Process meta collections.
      await _process(this, metaCollections)
    }

    for (const collection of this._collections) {
      if (collection.source._setApp && typeof (collection.source._setApp) === 'function') {
        collection.source._setApp(this)
      }

      // Call set app on processes.
      await call({
        concurrencyLimit: this.options.concurrencyLimit,
      }, collection.processes, '_setApp', this)
    }

    // Process collections.
    await _process(this, this._collections)

    if (this._processes) {
      // Call final on processes.
      await call({
        concurrencyLimit: this.options.concurrencyLimit,
      }, this._processes, 'final')
    }

    // Reset changed files.
    this._changedFiles = null

    return this
  }

  // Accessed.

  addAccessed (source, filePath) {
    // Ensure path is absolute.
    if (!path.isAbsolute(filePath)) {
      filePath = path.resolve(this.options.directoryPath, filePath)
    }

    if (!this._accessed[source]) {
      this._accessed[source] = [
        filePath,
      ]
      return
    }

    if (this._accessed[source].indexOf(filePath) < 0) {
      this._accessed[source].push(filePath)
    }
  }

  clearAccessed (source) {
    this._accessed[source] = undefined
  }

  resetAccessed () {
    this._accessed = {}
  }

  // Changed.

  setChanged (filePaths = null) {
    if (!filePaths) {
      this._changedFiles = null
    }

    const absolutePaths = []
    for (let filePath of filePaths) {
      if (!path.isAbsolute(filePath)) {
        filePath = path.resolve(this.options.directoryPath, filePath)
      }
      absolutePaths.push(filePath)
    }
    this._changedFiles = absolutePaths

    return this
  }

  hasChanged (source) {
    // Return true if no changed files are given.
    if (!this._changedFiles || this._changedFiles.indexOf(source) >= 0 || !this._accessed[source]) {
      return true
    }

    // Check if any of the changed files are in the accessed list.
    const filePaths = this._accessed[source]
    for (const changedFile of this._changedFiles) {
      if (filePaths.indexOf(changedFile) >= 0) {
        return true
      }
    }

    return false
  }
}

export default Hoast
