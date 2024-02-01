// Import internal modules.
import call from './call.js'
import iterate from './iterate.js'
import logger from './logger.js'

/**
 * Process collections.
 * @param {Object} library Library instance.
 * @param {Array} collections Collections to process.
 */
const process = async function (library, collections) {
  // Exit early if already done.
  if (collections.length === 0) {
    logger.info('No collections to process.')
    return
  }
  logger.info('Start processing collections.')

  const options = library.getOptions()

  // Iterate on collection sources and process them.
  await iterate(
    // Return a source process function.
    {
      collectionIndex: 0,
      collection: null,
      collectionProcesses: null,

      collectionsActiveByIndex: Array.from({ length: collections.length }, () => 0),
      collectionsExhausted: Array.from({ length: collections.length }, () => false),

      exhausted: false,

      next: async function (index) {
        if (!this.collection) {
          // Set collection.
          this.collection = collections[this.collectionIndex]

          // Prepare collections.
          this.collectionProcesses = this.collection.processes.map(process => {
            // If string get from lookup.
            if (typeof (process) === 'string') {
              process = library._processes[process]
            }

            return process
          })
        }

        // Store values locally.
        const collectionIndex = this.collectionIndex
        const source = this.collection.source
        const processes = this.collection.processes
        const processesPrepared = this.collectionProcesses

        // Increment active collections.
        this.collectionsActiveByIndex[collectionIndex]++

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
        if (source.exhausted && !this.collectionsExhausted[collectionIndex]) {
          this.collectionsExhausted[collectionIndex] = true
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

        // Decrement active count.
        this.collectionsActiveByIndex[collectionIndex]--

        if (source.done) {
          // Check if done and this is the last active collection call.
          if (this.collectionsActiveByIndex[collectionIndex] === 0) {
            // Call final on source.
            if (source.final && typeof (source.final) === 'function') {
              await source.final()
            }

            // Call final on processes only in this collection, globally registered processes are called later.
            await call({
              concurrencyLimit: options.concurrencyLimit,
            }, processes, 'final')
          }
        }
      },
    },
    options.concurrencyLimit,
    true,
  )

  logger.info('Finished processing collections.')
}

export default process
