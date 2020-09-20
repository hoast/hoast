// Import base class.
import BasePackage from '@hoast/base-package'

/**
 * Allow the first part of the next call to be executed sequentially and optionally a second part concurrently.
 */
class BaseSourcer extends BasePackage {
  constructor(...options) {
    super(...options)

    this.done = false
    this.exhausted = false

    this._hasInitialize = typeof (this.initialize) === 'function'
    this._hasSequential = typeof (this.sequential) === 'function'
    this._hasConcurrent = typeof (this.concurrent) === 'function'
    this._hasFinal = typeof (this.final) === 'function'

    if (this._hasInitialize) {
      this._isInitialized = false
    }
    if (this._hasInitialize || this._hasSequential) {
      this._holdCalls = false
      this._promiseQueue = []
    }
    if (this._hasConcurrent) {
      this._concurrentCount = 0
    }
  }

  async next (data) {
    // Exit early if done or exhausted.
    if (this.done || this.exhausted) {
      return
    }

    if ((!this._hasInitialize || this._isInitialized) && !this._hasSequential) {
      // Run concurrent part.
      return await this.concurrent()
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

  async _next (data) {
    if (this._hasSequential) {
      // Run sequential part.
      data = await this.sequential(data)
    }

    if (this._hasInitialize || this._hasSequential) {
      // If done wait for now.
      if (this.exhausted || this.done) {
        // Immediately resolve all queued promises.
        for (const promise of this._promiseQueue) {
          promise.resolve(null)
        }
        this._promiseQueue = []
      }

      // Set hold back to false.
      if (this._promiseQueue.length > 0) {
        // Run next iteration.
        const promise = this._promiseQueue.shift()
        try {
          promise.resolve(this._next(promise.data))
        } catch (error) {
          promise.reject(error)
        }
      } else {
        this.hold = false
      }
    }

    if (this._hasConcurrent) {
      // Increment concurrent count.
      this._concurrentCount++

      // Run concurrent part.
      data = await this.concurrent(data)

      // Decrement concurrent count.
      this._concurrentCount--
    }

    // If exhausted and no more concurreny of this source is going then set done to true!
    if (this.exhausted && (!this._hasConcurrent || this._concurrentCount === 0)) {
      if (this._hasFinal) {
        this.final()
      }

      this.done = true
    }

    return data
  }

  /*
   * Methods to extends when using this as your base class.
   * async initialize () { }
   * async sequential (data):data { }
   * async concurrent (data):data { }
   * final () { }
   */
}

export default BaseSourcer
