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

    this._hasSetup = typeof (this.setup) === 'function'
    this._hasSequential = typeof (this.sequential) === 'function'
    this._hasConcurrent = typeof (this.concurrent) === 'function'
    this._hasFinal = typeof (this.final) === 'function'
    // TODO: Use variables above for optimization and checking wether certain features need to be enabled or disabled entirly. For instance the promise system is not relevant if no sequantial or setup methods exist on this object.

    this._isInitialized = false
    this._concurrentCount = 0
    this._holdCalls = false
    this._promiseQueue = []
  }

  async next (...parameters) {
    // Exit early if done or exhausted.
    if (this.done || this.exhausted) {
      return
    }

    // Check if calls should be held.
    if (this._holdCalls) {
      // Add calls to queue.
      return await new Promise((resolve, reject) => {
        this._promiseQueue.push({
          resolve,
          reject,
          parameters,
        })
      })
    }

    // Hold new calls.
    this._holdCalls = true

    // Try to setup.
    await this._trySetup(...parameters)

    // Run now.
    const result = await this._run(...parameters)

    return result
  }

  async _trySetup (...parameters) {
    // Exit early if already initialized.
    if (this._isInitialized) {
      return
    }
    this._isInitialized = true

    // If setup exist invoke it.
    if (this._hasSetup) {
      await this.setup(...parameters)
    }
  }

  _tryShift () {
    // If done wait for now.
    if (this.exhausted || this.done) {
      // Immediately resolve all queued promises.
      for (const { resolve } of this._promiseQueue) {
        resolve(null)
      }
      this._promiseQueue = []
      return
    }

    // Set hold back to false.
    if (this._promiseQueue.length === 0) {
      this.hold = false
      return
    }

    // Run next iteration.
    const { resolve, reject, parameters } = this._promiseQueue.shift()
    try {
      resolve(this._run(...parameters))
    } catch (error) {
      reject(error)
    }
  }

  async _run (...parameters) {
    if (this._hasSequential) {
      // Run sequential part.
      parameters = await this.sequential(...parameters)
    }

    // Try and shift to the next call.
    this._tryShift()

    if (this._hasConcurrent) {
      // Increment concurrent count.
      this._concurrentCount++

      // Run concurrent part.
      parameters = await this.concurrent(...parameters)

      // Decrement concurrent count.
      this._concurrentCount--
    }

    // If exhausted and no more concurreny of this source is going then set done to true!
    if (this.exhausted && this._concurrentCount === 0) {
      this.done = true

      if (this._hasFinal) {
        this.final(...parameters)
      }
    }

    return parameters
  }

  /*
   * Methods to extends when using this as your base class.
   * async setup (...parameters) { }
   * async sequential (...parameters) { }
   * async concurrent (...parameters) { }
   * final (...parameters) { }
   */
}

export default BaseSourcer
