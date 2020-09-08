/**
 * Allow the first part of the next call to be executed sequentially and the second part concurrently.
 */
class SourceSequential {
  constructor() {
    this._isInitialized = false
    this._holdCalls = false
    this._promiseQueue = []
  }

  async _tryInit () {
    if (!this._isInitialized) {
      this._isInitialized = true
      if (typeof (this.init) === 'function') {
        await this.init()
      }
    }
  }

  async next (...paramaters) {
    // Check if calls should be held.
    if (this._holdCalls) {
      // Add calls to queue.
      await new Promise((resolve, reject) => {
        this._promiseQueue.push({
          resolve,
          reject,
          paramaters,
        })
      })
      return
    }

    // Hold new calls.
    this._holdCalls = true

    // Try to initialize.
    await this._tryInit()

    // Run now.
    await this._run(...paramaters)
  }

  async _tryShift () {
    // Set hold back to false.
    if (this._promises.length === 0) {
      this.hold = false
    }

    const { resolve, reject, paramaters } = this._promises.shift()
    try {
      resolve(await this._run(...paramaters))
    } catch (error) {
      reject(error)
    }
  }

  async _run (...paramaters) {
    // Run sequential part.
    const result = await this.sequential(...paramaters)

    // Try and shift to the next call.
    this._tryShift()

    // Run concurrent part
    return await this.concurrent(result)
  }

  async sequential () { }

  async concurrent () { }
}

export default SourceSequential
