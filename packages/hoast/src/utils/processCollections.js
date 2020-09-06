import iterate from './iterate.js'

/**
 * Process collections.
 * @param {Object} app App instance.
 * @param {Array} collections Collections to process.
 */
const processCollections = async function (app, collections) {
  // Current collection.
  let collectionIndex = -1
  let collection
  let processesPrepared

  /**
   * Get and set the next collection.
   * @returns {Bool} Returns true if finished and no more collections available.
   */
  const next = async function () {
    // Increment collection.
    collectionIndex++

    // Exit early if index exceeds collections.
    if (collectionIndex >= collections.length) {
      collection = null
      processesPrepared = null

      return false
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
  if (!await next()) {
    return
  }

  // Iterate on collection sources and process them.
  await iterate(
    // Return a source process method.
    {
      done: false,
      next: async () => {
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
          if (!await next()) {
            this.done = true
          }
        }
      },
    },
    app.options.concurrencyLimit
  )
}

export default processCollections
