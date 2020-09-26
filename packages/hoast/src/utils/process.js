// Import internal modules.
import call from './call.js'
import iterate from './iterate.js'
import logger from './logger.js'

/**
 * Process collections.
 * @param {Object} app App instance.
 * @param {Array} collections Collections to process.
 */
const process = async function (app, collections) {
  // Exit early if already done.
  if (collections.length === 0) {
    logger.info('No collections to process.')
    return
  }
  logger.info('Start processing collections.')

  // Iterate on collection sources and process them.
  await iterate(
    // Return a source process method.
    {
      collectionsExhausted: collections.map(() => false),
      collectionsActive: collections.map(() => 0),
      collectionIndex: 0,
      collection: null,
      collectionProcesses: null,

      exhausted: false,

      next: async function () {
        if (!this.collection) {
          // Set collection.
          this.collection = collections[this.collectionIndex]

          // Prepare collections.
          this.collectionProcesses = this.collection.processes.map(process => {
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
        }

        // Store values locally.
        const index = this.collectionIndex
        const source = this.collection.source
        const processes = this.collection.processes
        const processesPrepared = this.collectionProcesses

        // Increment active collections.
        this.collectionsActive[index]++

        // Get data from source.
        let data = await source.next()

        if (data) {
          // Iterate over processes.
          for (const process of processesPrepared) {
            // Skip if data is null.
            if (data === undefined || data === null) {
              break
            }

            data = await process.next(data)
          }
        }

        // Check source is exhausted and was not exhausted previously.
        if (source.exhausted && !this.collectionsExhausted[index]) {
          this.collectionsExhausted[index] = true
          // Check if more collections left.
          if (this.collectionIndex < collections.length - 1) {
            // Unset collection.
            this.collection = null
            this.collectionProcesses = null

            // Increment collection index.
            this.collectionIndex++
          } else {
            // Set iterator as exhausted.
            this.exhausted = true
          }
        }

        // Check if done and this is the last active collection call.
        if (source.done && this.collectionsActive[index] === 1) {
          // Call final on processes only in this collection.
          await call({
            concurrencyLimit: app.options.concurrencyLimit,
          }, processes, 'final')
        }

        // Decrement active count.
        this.collectionsActive[index]--
      },
    },
    app.options.concurrencyLimit
  )

  logger.info('Finished processing collections.')
}

export default process
