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

    this._isInitialized = false
    this._concurrentCount = 0
    this._holdCalls = false
    this._promiseQueue = []
  }

  async next (app) {
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
          app,
        })
      })
    }

    // Hold new calls.
    this._holdCalls = true

    // Try to setup.
    await this._trySetup(app)

    // Run now.
    const result = await this._run(app)

    return result
  }

  async _trySetup () {
    // Exit early if already initialized.
    if (this._isInitialized) {
      return
    }
    this._isInitialized = true

    // If setup exist invoke it.
    if (typeof (this.setup) === 'function') {
      await this.setup()
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
    const { resolve, reject, app } = this._promiseQueue.shift()
    try {
      resolve(this._run(app))
    } catch (error) {
      reject(error)
    }
  }

  async _run (app) {
    let result = null
    if (typeof (this.sequential) === 'function') {
      // Run sequential part.
      result = await this.sequential(app)
    }

    // Try and shift to the next call.
    this._tryShift()

    if (typeof (this.concurrent) === 'function') {
      // Increment concurrent count.
      this._concurrentCount++

      // Run concurrent part.
      result = await this.concurrent(app, result)

      // Decrement concurrent count.
      this._concurrentCount--
    }

    // If exhausted and no more concurreny of this source is going then set done to true!
    if (this.exhausted && this._concurrentCount === 0) {
      this.done = true

      if (typeof (this.final) === 'function') {
        this.final(app)
      }
    }

    return result
  }

  /*
   * Methods to extends when using this as your base class.
   * async setup (app:Hoast) { }
   * async sequential (app:Hoast) { }
   * async concurrent (app:Hoast) { }
   * final (app:Hoast) { }
   */
}

export default BaseSourcer
