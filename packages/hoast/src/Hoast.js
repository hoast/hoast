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
   * @param {Object} data Data object.
   */
  constructor(options = null, data = null) {
    // Set options.
    this.options = {
      directory: process.cwd(),
    }
    if (options) {
      this.setOptions(options)
    }

    // Initialize collections.
    this.collections = []
    // Initialize data object.
    this.data = {}
    this.setData(data)
    // Initialize modules registry.
    this.modulesSource = {}
    this.modulesProcess = {}
  }

  /**
   * Set options.
   * @param {Object} options Options object.
   */
  setOptions(options) {
    if (typeof (options) !== 'object') {
      return
    }

    this.options = Object.assign(this.options, options)
  }

  // Data.

  setData(data) {
    if (typeof (data) !== 'object') {
      return
    }

    this.data = merge(this.data, data)
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

    this.modulesSource[name] = source
  }

  registerSources(...sources) {
    sources = sources.filter(({ name, source }) => {
      if (typeof (name) !== 'string') {
        return false
      }
      return isValidSource(source)
    })

    this.modulesSource = Object.assign(this.modulesSource, sources)
  }

  // Processs.

  registerProcess(name, process) {
    if (typeof (name) !== 'string') {
      return
    }
    if (!isValidProcess(process)) {
      return
    }

    this.modulesProcess[name] = process
  }

  registerProcesss(...processs) {
    processs = processs.filter(({ name, process }) => {
      if (typeof (name) !== 'string') {
        return false
      }
      return isValidProcess(process)
    })

    this.modulesProcess = Object.assign(this.modulesProcess, processs)
  }

  /**
   * Process collections.
   */
  async process() {
    // Call before on sources and processs.
    await callAsync(this.modulesSource, 'before', this)
    await callAsync(this.modulesProcess, 'before', this)

    // Fetch data from sources and put in data.
    // TODO: ...

    // Iterate over collections.
    for (const collection in this.collections) {
      // Prepare processs.
      const processes = collection.process.map(process => prepareProcess(process))

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

    // Call after on sources and processs.
    await callAsync(this.modulesSource, 'after', this)
    await callAsync(this.modulesProcess, 'after', this)
  }
}

export default Hoast
