/**
 * Allow the first part of the next call to be executed sequentially and optionally a second part concurrently.
 */
class ConcurrentIterator {
  constructor() {
    this.done = false
    this.exhausted = false

    this._isInitialized = false
    this._isFinalized = false

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
    await this._trySetup()

    // Run now.
    const result = await this._run(...parameters)

    return result
  }

  async _trySetup () {
    // Exit early if already setupd.
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
      this._promiseQueue.forEach(({ resolve }) => {
        resolve(null)
      })
      this._promiseQueue = []

      if (typeof (this.final) === 'function') {
        this.final()
      }
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
    let result = null
    if (typeof (this.sequential) === 'function') {
      // Run sequential part.
      result = await this.sequential(...parameters)
    }

    // Try and shift to the next call.
    this._tryShift()

    if (typeof (this.concurrent) === 'function') {
      // Increment concurrent count.
      this._concurrentCount++

      // Run concurrent part.
      result = await this.concurrent(result)

      // Decrement concurrent count.
      this._concurrentCount--
    }

    // If exhausted and no more concurreny of this source is going then set done to true!
    if (this.exhausted && this._concurrentCount === 0) {
      this.done = true
    }

    return result
  }

  /**
   * Methods to extends when using this as your base class.
   *
   * async setup () { }
   * async sequential () { }
   * async concurrent () { }
   * async final () { }
   */
}

export default ConcurrentIterator
