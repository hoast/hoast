// Import external modules.
import { hasKeys } from '@hoast/utils/has.js'
import merge from '@hoast/utils/merge.js'

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

  // Options

  /**
   * Assign data to options.
   * @param {Object} options Options object.
   */
  setOptions (options) {
    if (typeof (options) !== 'object') {
      return this
    }

    this.options = Object.assign(this.options, options)

    return this
  }

  // Meta.

  /**
   * Assign data to meta data.
   * @param {Object} meta Data to merge with current meta data.
   */
  setMeta (meta) {
    if (typeof (meta) !== 'object') {
      return this
    }

    this.meta = merge(this.meta, meta)

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
        // Clone collection data.
        collection = merge({}, collection)

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

    // Prepare collections.
    const collections = this._collections.map(collection => {
      // Clone collection data.
      return merge({}, collection)
    })

    // Process collections.
    await processCollections(this, collections)

    if (this._processes) {
      // Call finally on processes.
      await callAsync(this._processes, 'finally', this)
    }

    return this
  }
}

export default Hoast
