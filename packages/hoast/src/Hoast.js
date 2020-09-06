// Import internal modules.
import { callAsync } from './util/call.js'
import { hasKeys } from '@hoast/utils/has.js'
import iterate from './util/iterate.js'
import merge from '@hoast/utils/merge.js'

const isValidCollection = function (data) {
  if (hasKeys(data, ['sources'])) {
    return hasKeys(data.sources, ['next'])
  }
  return false
}

const isValidProcess = function (data) {
  return hasKeys(data, ['process'])
}

class Hoast {
  /**
   * Create Hoast instance.
   * @param {Object} options Options object.
   * @param {Object} meta Meta object.
   */
  constructor(options = null, meta = null) {
    // Set options.
    this.options = {
      concurrentLimit: 16,
      ignoreCache: false,
    }
    if (options) {
      this.setOptions(options)
    }

    // Set data object.
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
    if (!isValidCollection(collection)) {
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
    collections = collections.filter((collection) => isValidCollection(collection))
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
    if (!isValidCollection(collection)) {
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
    collections = collections.filter(collection => isValidCollection(collection))
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
    if (!isValidProcess(process)) {
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

      const process = processes[name]

      if (!isValidProcess(process)) {
        continue
      }

      processesFiltered[name] = process
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
    // Store this as app.
    const app = this

    const processCollections = async function (collections) {
      // Current collection.
      let collectionIndex = -1
      let collection
      let processesPrepared

      /**
       * Get and set the next collection.
       * @returns {Bool} Returns true if finished and no more collections available.
       */
      const setNextCollection = function () {
        // Increment collection.
        collectionIndex++

        // Exit early if index exceeds collections.
        if (collectionIndex >= collections.length) {
          collection = null
          processesPrepared = null

          return true
        }

        // Get collection at index.
        collection = collections[collectionIndex]

        // Prepare collection processes.
        processesPrepared = collection.processes.map(process => {
          let processType = typeof (process)

          // If string get from lookup.
          if (processType === 'string') {
            process = app._processes[process]

            // Get type again.
            processType = typeof (process)
          }

          // If function wrap in object.
          if (processType === 'function') {
            process = {
              process: process,
            }
          }

          return process
        })

        return true
      }

      // Exit early if already done.
      if (setNextCollection()) {
        return
      }

      // Iterate on collection sources and process them.
      await iterate(
        function () {
          // Return a source process method.
          return async () => {
            // Store collection data locally.
            const _source = collection.source
            const _processes = collection.processes
            const _processesPrepared = processesPrepared

            // Get data from source.
            let data = await _source.next(app)

            // Skip if source is done.
            if (!_source.done) {
              // Iterate over processes.
              for (const process of _processesPrepared) {
                data = await process.process(app, data)
              }
            } else {
              // Call finally on object processes from this collection.
              for (const process of _processes) {
                if (typeof (process) === 'object' && Object.prototype.hasOwnProperty.call(process, 'finally')) {
                  await process.finally(app)
                }
              }

              // Set next collection.
              if (setNextCollection()) {
                this.done = true
              }
            }
          }
        },
        this.options.concurrentLimit
      )
    }

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
      await processCollections(metaCollections)
    }

    // Prepare collections.
    const collections = this._collections.map(collection => {
      // Clone collection data.
      return merge({}, collection)
    })

    // Process collections.
    await processCollections(collections)

    if (this._processes) {
      // Call finally on processes.
      await callAsync(this._processes, 'finally', this)
    }

    return this
  }
}

export default Hoast
