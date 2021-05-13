// Import base class.
import BasePackage from '@hoast/base-package'

class BaseProcess extends BasePackage {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(...options) {
    super({
      filter: null,
    }, ...options)

    this._hasInitialize = typeof (this.initialize) === 'function'
    this._hasSequential = typeof (this.sequential) === 'function'
    this._hasConcurrent = typeof (this.concurrent) === 'function'

    this.reset()
  }

  reset () {
    if (this._hasInitialize) {
      this._isInitialized = false
    }
    if (this._hasInitialize || this._hasSequential) {
      this._holdCalls = false
      this._promiseQueue = []
    }
  }

  final () {
    this.reset()
  }

  /**
   * This will be called by hoast itself to process the given item.
   * @param {Any} data Data to process.
   * @returns {Any} Processed data.
   */
  async next (data) {
    // Exit early now if filtered out.
    if (this._options.filter) {
      // Skip if custom functions returns false.
      if (!this._options.filter(data)) {
        return data
      }
    }

    if ((!this._hasInitialize || this._isInitialized) && !this._hasSequential) {
      // Run concurrent part.
      return await this.concurrent(data)
    }

    // Check if calls should be held.
    if (this._holdCalls) {
      // Add calls to queue.
      return await new Promise((resolve, reject) => {
        this._promiseQueue.push({
          resolve,
          reject,
          data,
        })
      })
    }

    // Hold new calls.
    this._holdCalls = true

    // Try initialization.
    if (this._hasInitialize && !this._isInitialized) {
      await this.initialize()
      this._isInitialized = true
    }

    // Run now.
    return await this._next(data)
  }

  /**
   * Internally called to process the given item.
   * @param {Any} data Data to process.
   * @returns {Any} Processed data.
   */
  async _next (data) {
    if (this._hasSequential) {
      // Run sequential part.
      data = await this.sequential(data)
    }

    if (this._hasInitialize || this._hasSequential) {
      // Run any promises.
      if (this._promiseQueue.length > 0) {
        // Run next iteration.
        const promise = this._promiseQueue.shift()
        try {
          promise.resolve(this._next(promise.data))
        } catch (error) {
          promise.reject(error)
        }
      } else {
        // Set hold back to false.
        this._holdCalls = false
      }
    }

    if (this._hasConcurrent) {
      // Run concurrent part.
      data = await this.concurrent(data)
    }

    return data
  }
}

export default BaseProcess
