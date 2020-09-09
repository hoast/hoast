// Import external modules.
import Debugger from '@hoast/utils/Debugger.js'
import { hasKeys } from '@hoast/utils/has.js'
import deepAssign from '@hoast/utils/deepAssign.js'

// Import internal modules.
import { callAsync } from './utils/call.js'
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
      concurrencyLimit: 4,
      ignoreCache: false,
    }

    if (options) {
      this.setOptions(options)
    }

    // Set meta data object.
    this.meta = {}
    this.setMeta(meta)

    // Initialize meta collections.
    this._metaCollections = []

    // Initialize collections.
    this._collections = []

    // Initialize modules registry.
    this._processes = {}
  }

  /**
   * Set the level of the debugger.
   * @param {Number} debugLevel Level of log messages to show.
   */

  _setDebugLevel (debugLevel) {
    if (!this.debugger) {
      this.debugger = new Debugger(debugLevel)
      return
    }

    this.debugger.setLevel(debugLevel)
  }

  // Options

  /**
   * Assign data to options.
   * @param {Object} options Options object.
   */
  setOptions (options) {
    if (typeof (options) !== 'object') {
      return this
    }

    // deepAssign current with new iptions
    this.options = deepAssign(this.options, options)

    // Set debug level based of the options.
    this._setDebugLevel(this.options.debugLevel)

    return this
  }

  // Meta.

  /**
   * Assign data to meta data.
   * @param {Object} meta Data to deepAssign with current meta data.
   */
  setMeta (meta) {
    if (typeof (meta) !== 'object') {
      return this
    }

    this.meta = deepAssign(this.meta, meta)

    return this
  }

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
