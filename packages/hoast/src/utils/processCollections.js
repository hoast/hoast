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
  const next = function () {
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

    if (typeof (collection.source.next) !== 'function') {
      collection.sourceIsSync = true
    }

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
  if (!next()) {
    return
  }

  // Iterate on collection sources and process them.
  await iterate(
    // Return a source process method.
    {
      exhausted: false,
      next: async function () {
        // Store collection data locally.
        const _source = collection.source
        const _processes = collection.processes
        const _processesPrepared = processesPrepared

        // Get data from source.
        let data
        if (collection.sourceIsSync) {
          data = _source.nextSync(app)
        } else {
          data = await _source.next(app)
        }

        if (data) {
          // Iterate over processes.
          for (const process of _processesPrepared) {
            // Skip if data is null.
            if (data === undefined || data === null) {
              break
            }

            data = await process.process(app, data)
          }
        }

        // Set next collection if current is exhausted.
        if (_source.exhausted && !this.exhausted) {
          if (!next()) {
            this.exhausted = true
          }
        }

        if (_source.done) {
          // Call final on object processes from this collection.
          for (const process of _processes) {
            if (typeof (process) === 'object' && typeof (process.final) === 'function') {
              await process.final(app)
            }
          }
        }
      },
    },
    app.options.concurrencyLimit
  )
}

export default processCollections
