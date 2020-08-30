// Import internal modules.
import { callAsync } from './utilities/call.js'
import iterate from './utilities/iterate.js'
import merge from './utilities/merge.js'
import { prepareModule } from './utilities/prepare.js'
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
    const processCollections = async function (collections) {
      // Exit early if no collections.
      if (!collections.length) {
        return
      }

      // Current collection.
      let collectionsDone = false
      let collectionIndex = -1
      let collection
      // Current collection source.
      let sourceIndex
      let source

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
        source = collection.sources[sourceIndex]
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
            // Get data from source.
            const data = await source.next()

            // TODO:

            // Check if source is done.
            if (source.done) {
              // Call finally on source. TODO: Since the source itself handles when it is done a finally call is not neccesary. Right?
              if (Object.prototype.hasOwnProperty.call(source, 'finally')) {
                source.finally()
              }

              // Set next collection.
              nextCollection()

              // Exit early if done.
              if (collectionsDone) {
                this.done = true
              }
            }
          }
        },
        this.options.concurrentLimit
      )

      //
      //
      // ...
      //
      //

      // Iterate over meta collections.
      for (const collection in collections) {
        // Prepare processes.
        const processes = collection.processes.map(process => prepareModule(this.processes, process))

        // ...

        // Iterate over collection sources.
        // TODO: should iterate over sources of multiple collections if possible.
        // Bundle which collection it belongs to then grab the processes from that?
        // Write a source iterator that moves to the next collection if the current has run out!
        const sourceIterator = function () { }
        await iterate(sourceIterator, this.options.concurrentLimit)

        // ...

        const sources = Array.isArray(collection.sources) ? collection.sources : [collection.sources]
        for (const _source in sources) {
          const source = prepareModule(this.sources, _source)
          const iterate = source.module.iterator(this, ...source.options)

          // TODO: Why are options even passed, could all be know before hand.
          // TODO: Iterator should listen to done being truthy instead of waiting for null.
          let data
          while ((data = await iterate()) !== null) {
            for (const process in processes) {
              // Process data.
              data = await process.module.process(this, data, ...process.options)

              // If data is null stop processing.
              if (data === null) {
                break
              }
            }
          }
        }
      }
    }

    // TODO: Before should be called if it hasn't yet before first use.
    // Call before on sources and processes.
    await callAsync(this.sources, 'before', this)
    await callAsync(this.processes, 'before', this)

    // Add 'assign to meta' process at the end of each meta collection.
    const metaCollections = this.metaCollections.map((collection) => {
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

    // Process collections.
    await processCollections(this.collections)

    // TODO: After should be called at the end if before was called.
    // Call after on sources and processes.
    await callAsync(this.sources, 'after', this)
    await callAsync(this.processes, 'after', this)
  }
}

export default Hoast
