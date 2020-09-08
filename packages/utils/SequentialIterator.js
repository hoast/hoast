/**
 * Allow the first part of the next call to be executed sequentially and the second part concurrently.
 */
class SequentialIterator {
  constructor() {
    this.done = false
    this.exhausted = false

    this._isFinalized = false
    this._isInitialized = false

    this._concurrentCount = 0
    this._holdCalls = false
    this._promiseQueue = []
  }

  async _tryInitialize () {
    // Exit early if already initialized.
    if (this._isInitialized) {
      return
    }
    this._isInitialized = true

    // If initialize exist invoke it.
    if (typeof (this.initialize) === 'function') {
      await this.initialize()
    }
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

    // Try to initialize.
    await this._tryInitialize()

    // Run now.
    const result = await this._run(...parameters)

    return result
  }

  _tryShift () {
    // If done wait for now.
    if (this.exhausted || this.done) {
      // Immediately resolve all queued promises.
      this._promiseQueue.forEach(({ resolve }) => {
        resolve(null)
      })
      this._promiseQueue = []

      if (typeof (this.finally) === 'function') {
        this.finally()
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
    // Run sequential part.
    let result = await this.sequential(...parameters)

    // Try and shift to the next call.
    this._tryShift()

    // Increment concurrent count.
    this._concurrentCount++

    // Run concurrent part.
    result = await this.concurrent(result)

    // Decrement concurrent count.
    this._concurrentCount--

    // If exhausted and no more concurreny of this source is going then set done to true!
    if (this.exhausted && this._concurrentCount === 0) {
      this.done = true
    }

    return result
  }

  initialize () { }
  sequential () { }
  concurrent () { }
  finally () { }
}

export default SequentialIterator
