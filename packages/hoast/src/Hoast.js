// Import external modules.
import { hasKeys } from '@hoast/utils/has.js'
import deepAssign from '@hoast/utils/deepAssign.js'

// Import internal modules.
import { callAsync } from './utils/call.js'
import logger from './utils/logger.js'
import processCollections from './utils/processCollections.js'

class Hoast {
  /**
   * Create Hoast instance.
   * @param {Object} options Options object.
   * @param {Object} meta Meta object.
   */
  constructor(options = null, meta = null) {
    // Set options.
    this.options = {
      logLevel: 2,

      concurrencyLimit: 4,
      ignoreCache: false,
    }
    if (options) {
      this.options = deepAssign(this.options, options)
    }

    // Set meta.
    this.meta = meta || {}

    // Initialize meta collections.
    this._metaCollections = []

    // Initialize collections.
    this._collections = []

    // Initialize modules registry.
    this._processes = {}

    // Set debugger.
    logger.setLevel(this.options.logLevel)
    logger.setPrefix(this.constructor.name)
  }

  // Meta.

  /**
   * Add collection to meta collections.
   * @param {Object} collection Collection to add.
   */
  addMetaCollection (collection) {
    if (!hasKeys(collection, ['source'])) {
      return this
    }

    this._metaCollections.push(collection)

    return this
  }

  /**
   * Add collections to meta collections.
   * @param {Array} collections Collections to add.
   */
  addMetaCollections (collections) {
    // Filter based on type.
    collections = collections.filter((collection) => hasKeys(collection, ['source']))
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
   */
  addCollection (collection) {
    if (!hasKeys(collection, ['source'])) {
      return this
    }

    this._collections.push(collection)

    return this
  }

  /**
   * Add collections to collections.
   * @param {Array} collections Collections to add.
   */
  addCollections (collections) {
    // Filter based on type.
    collections = collections.filter(collection => hasKeys(collection, ['source']))
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
   */
  registerProcess (name, process) {
    if (typeof (name) !== 'string') {
      return this
    }

    this._processes[name] = process

    return this
  }

  /**
   * Register processes.
   * @param {Object} processes Process objects by name as key.
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
   */
  async process () {
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

      // Process meta collections.
      await processCollections(this, metaCollections)
    }

    // Process collections.
    await processCollections(this, this._collections)

    if (this._processes) {
      // Call finally on processes.
      await callAsync(this._processes, 'finally', this)
    }

    return this
  }
}

export default Hoast
