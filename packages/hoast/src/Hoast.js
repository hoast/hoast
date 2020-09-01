// Import internal modules.
import { callAsync } from './util/call.js'
import { hasKeys } from './util/has.js'
import iterate from './util/iterate.js'
import merge from './util/merge.js'

const isValidCollection = function (data) {
  if (hasKeys(data, ['sources'])) {
    return hasKeys(data.sources, ['next'])
  }
  return false;
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
    this._metaCollections = {}

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
    for (const name in Object.keys(processes)) {
      if (typeof (name) !== 'string') {
        continue
      }

      if (!processes.hasOwnProperty(name)) {
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
      // Exit early if no collections.
      if (!collections.length) {
        return
      }

      // Current collection.
      let collectionsDone = false
      let collectionIndex = -1
      let collection
      // Current collection source index.
      let sourceIndex

      const nextCollection = function () {
        // Get first collection with sources.
        do {
          // Increment collection.
          collectionIndex++

          // Exit early if index exceeds collections.
          if (collectionIndex >= collections.length) {
            collectionsDone = true
            return
          }

          // Get collection at index.
          collection = collections[collectionIndex]
        } while (!collection.sources.length)

        sourceIndex = 0
      }

      // Set initial collection.
      nextCollection()

      // Exit early if already done.
      if (collectionsDone) {
        return
      }

      // Iterate on collection sources and process them.
      await iterate(
        function () {
          // Return a source process method.
          return async () => {
            // Store collection data locally.
            const _source = collection.sources[sourceIndex]
            const _processes = collection.processes

            // Prepare processes.
            const _processesPrepared = _processes.map(process => {
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

            // Get data from source.
            let data = await _source.next()

            // Iterate over processes.
            for (const process in _processesPrepared) {
              data = await process.process(app, data)
            }

            // Check if source is done.
            if (_source.done) {
              // Increment source index.
              sourceIndex++

              // Check if all sources finished.
              if (sourceIndex >= collection.sources.length) {
                // Call finally on object processes from this collection.
                _processes.forEach(process => {
                  if (typeof (process) === 'object' && Object.prototype.hasOwnProperty.call(process, 'finally')) {
                    process.finally(app)
                  }
                })

                // Set next collection.
                nextCollection()

                // Exit early if done.
                if (collectionsDone) {
                  this.done = true
                }
              }
            }
          }
        },
        this.options.concurrentLimit
      )
    }

    // Prepare meta collections.
    const metaCollections = this._metaCollections.map(collection => {
      collection = merge({}, collection)

      // Ensure sources and processes are arrays.
      if (!Array.isArray(collection.sources)) {
        collection.sources = [collection.sources]
      }
      if (!Array.isArray(collection.processes)) {
        collection.processes = [collection.processes]
      }

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

    // Prepare collections.
    const collections = this._collections.map(collection => {
      collection = merge({}, collection)

      // Ensure sources and processes are arrays.
      if (!Array.isArray(collection.sources)) {
        collection.sources = [collection.sources]
      }
      if (!Array.isArray(collection.processes)) {
        collection.processes = [collection.processes]
      }

      return collection
    })

    // Process collections.
    await processCollections(collections)

    // Call finally on processes.
    await callAsync(this._processes, 'finally', this)

    return this
  }
}

export default Hoast
