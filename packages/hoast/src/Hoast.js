// Import build-in modules.
// ...
// Import external modules.
// ...
// Import internal modules.
import { callAsync } from './utilities/call.js'
import merge from './utilities/merge.js'
import { prepareProcess, prepareSource } from './utilities/prepare.js'
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
      directory: process.cwd(),
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
  assignOptions(options) {
    if (typeof (options) !== 'object') {
      return
    }

    this.options = Object.assign(this.options, options)
  }

  // Meta.

  assignMeta(meta) {
    if (typeof (meta) !== 'object') {
      return
    }

    this.meta = merge(this.meta, meta)
  }

  addMetaCollection(collection) {
    if (typeof (collection) !== 'object') {
      return
    }

    this.metaCollections.push(collection)
  }

  addMetaCollections(...collections) {
    // Filter based on type.
    collections = collections.filter((collection) => typeof (collection) === 'object')
    if (!collections) {
      return
    }

    // Add to collections.
    this.metaCollections.push(...collections)
  }

  // Collections.

  addCollection(collection) {
    if (typeof (collection) !== 'object') {
      return
    }

    this.collections.push(collection)
  }

  addCollections(...collections) {
    // Filter based on type.
    collections = collections.filter((collection) => typeof (collection) === 'object')
    if (!collections) {
      return
    }

    // Add to collections.
    this.collections.push(...collections)
  }

  // Sources

  registerSource(name, source) {
    if (typeof (name) !== 'string') {
      return
    }
    if (!isValidSource(source)) {
      return
    }

    this.sources[name] = source
  }

  registerSources(...sources) {
    sources = sources.filter(({ name, source }) => {
      if (typeof (name) !== 'string') {
        return false
      }
      return isValidSource(source)
    })

    this.sources = Object.assign(this.sources, sources)
  }

  // Processes.

  registerProcess(name, process) {
    if (typeof (name) !== 'string') {
      return
    }
    if (!isValidProcess(process)) {
      return
    }

    this.processes[name] = process
  }

  registerProcesses(...processes) {
    processes = processes.filter(({ name, process }) => {
      if (typeof (name) !== 'string') {
        return false
      }
      return isValidProcess(process)
    })

    this.processes = Object.assign(this.processes, processes)
  }

  /**
   * Process collections.
   */
  async process() {
    // Call before on sources and processes.
    await callAsync(this.sources, 'before', this)
    await callAsync(this.processes, 'before', this)

    // Iterate over meta collections.
    for (const collection in this.metaCollections) {
      // Prepare processes.
      const processes = collection.processes.map(process => prepareProcess(process))

      // Iterate over collection sources.
      for (const _source in collection.sources) {
        const source = prepareSource(_source)
        const iterate = source.module.iterator(this, ...source.options)

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

          // Merge data with meta.
          this.assignMeta(data)
        }
      }
    }

    // Iterate over collections.
    for (const collection in this.collections) {
      // Prepare processes.
      const processes = collection.processes.map(process => prepareProcess(process))

      // Iterate over collection sources.
      for (const _source in collection.sources) {
        const source = prepareSource(_source)
        const iterate = source.module.iterator(this, ...source.options)

        // TODO: Could I create a system that a soon as one finishes an other is added to a promise until a max of concurrencies is reached.

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

    // Call after on sources and processes.
    await callAsync(this.sources, 'after', this)
    await callAsync(this.processes, 'after', this)
  }
}

export default Hoast
