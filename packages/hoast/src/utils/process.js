// Import internal modules.
import { callSync } from './call.js'
import iterate from './iterate.js'
import logger from './logger.js'

/**
 * Process collections.
 * @param {Object} app App instance.
 * @param {Array} collections Collections to process.
 */
const process = async function (app, collections) {
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

      logger.info('No more collections to iterate over.')
      return false
    }
    if (collectionIndex > 0) {
      logger.info('Start processing next collection.')
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
    logger.info('No collections to process.')
    return
  }
  logger.info('Start processing collections.')

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

            data = await process.next(app, data)
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
          callSync(_processes, 'final', app)
        }
      },
    },
    app.options.concurrencyLimit
  )

  logger.info('Finished processing collections.')
}

export default process
