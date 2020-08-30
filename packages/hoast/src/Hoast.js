// Import internal modules.
import { callAsync } from './utilities/call.js'
import iterate from './utilities/iterate.js'
import merge from './utilities/merge.js'
import { isValidProcess, isValidSource } from './utilities/isvalid.js'

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
    }
    if (options) {
      this.assignOptions(options)
    }

    // Set data object.
    this.meta = {}
    this.assignMeta(meta)
    // Initialize meta collections.
    this.metaCollections = {}

    // Initialize collections.
    this.collections = []

    // Initialize modules registry.
    this.sources = {}
    this.processes = {}
  }

  /**
   * Set options.
   * @param {Object} options Options object.
   */
  assignOptions (options) {
    if (typeof (options) !== 'object') {
      return
    }

    this.options = Object.assign(this.options, options)

    return this
  }

  // Meta.

  assignMeta (meta) {
    if (typeof (meta) !== 'object') {
      return
    }

    this.meta = merge(this.meta, meta)

    return this
  }

  addMetaCollection (collection) {
    if (typeof (collection) !== 'object') {
      return
    }

    this.metaCollections.push(collection)

    return this
  }

  addMetaCollections (...collections) {
    // Filter based on type.
    collections = collections.filter((collection) => typeof (collection) === 'object')
    if (!collections) {
      return
    }

    // Add to collections.
    this.metaCollections.push(...collections)

    return this
  }

  // Collections.

  addCollection (collection) {
    if (typeof (collection) !== 'object') {
      return
    }

    this.collections.push(collection)

    return this
  }

  addCollections (...collections) {
    // Filter based on type.
    collections = collections.filter((collection) => typeof (collection) === 'object')
    if (!collections) {
      return
    }

    // Add to collections.
    this.collections.push(...collections)

    return this
  }

  // Sources
  // TODO:
  // Source function should not be registered before hand and re-used.
  // Instead should always be a newly defined function or object with iterator method.

  registerSource (name, source) {
    if (typeof (name) !== 'string') {
      return
    }
    if (!isValidSource(source)) {
      return
    }

    this.sources[name] = source

    return this
  }

  registerSources (...sources) {
    sources = sources.filter(({ name, source }) => {
      if (typeof (name) !== 'string') {
        return false
      }
      return isValidSource(source)
    })

    this.sources = Object.assign(this.sources, sources)

    return this
  }

  // Processes.

  registerProcess (name, process) {
    if (typeof (name) !== 'string') {
      return
    }
    if (!isValidProcess(process)) {
      return
    }

    this.processes[name] = process

    return this
  }

  registerProcesses (...processes) {
    processes = processes.filter(({ name, process }) => {
      if (typeof (name) !== 'string') {
        return false
      }
      return isValidProcess(process)
    })

    this.processes = Object.assign(this.processes, processes)

    return this
  }

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
                process = app.processes[process]

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
    const metaCollections = this.metaCollections.map(collection => {
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
    const collections = this.collections.map(collection => {
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
    await callAsync(this.processes, 'finally', this)
  }
}

export default Hoast
