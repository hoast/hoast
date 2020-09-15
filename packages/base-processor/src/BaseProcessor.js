// Import base class.
import BasePackage from '@hoast/base-package.js'

// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import planckmatch from 'planckmatch'

/**
 * Adds setup method to processors and pattern filtering.
 */
class BaseProcessor extends BasePackage {
  constructor(...options) {
    super({
      filterPatterns: null,
      filterOptions: {
        // Which item(s) to check if the field value is an array.
        array: 'first', // first, last, all, any.
      },
      filterProperty: null,
    }, ...options)

    this._hasSetup = typeof (this.setup) === 'function'
    this._hasSequential = typeof (this.sequential) === 'function'
    this._hasConcurrent = typeof (this.concurrent) === 'function'
    // TODO: Use variables above for optimization and checking wether certain features need to be enabled or disabled entirly. For instance the promise system is not relevant if no sequantial or setup methods exist on this object.

    this._isInitialized = false
    this._concurrentCount = 0
    this._holdCalls = false
    this._promiseQueue = []

    // Parse filter patterns into regular expressions.
    if (this._options.filterPatterns && this._options.filterPatterns.length > 0) {
      this._filterExpressions = this._options.filterPatterns.map(pattern => {
        return planckmatch.parse(pattern, this._options.filterOptions, this._options.filterOptions.isPath)
      })
    }

    if (this._options.filterProperty) {
      this._filterPropertyPath = this._options.filterProperty.split('.')
    }
  }

  async next (data) {
    // Exit early now if filtered out.
    if (this._filterExpressions) {
      // TODO: Expressions should check against whether the value is an array or a string. See this._options.filterOptions.array option.
      const value = getByPathSegments(data, this._filterPropertyPath)
      const matches = this._options.filterOptions.all ? planckmatch.match.all(value, this._filterExpressions) : planckmatch.match.any(value, this._filterExpressions)
      if (!matches) {
        return data
      }
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

    // Try to setup.
    await this._trySetup(data)

    // Run now.
    const result = await this._run(data)

    return result
  }

  async _trySetup (data) {
    // Exit early if already initialized.
    if (this._isInitialized) {
      return
    }
    this._isInitialized = true

    // If setup exist invoke it.
    if (this._hasSetup) {
      await this.setup(data)
    }
  }

  _tryShift () {
    // Set hold back to false.
    if (this._promiseQueue.length === 0) {
      this.hold = false
      return
    }

    // Run next iteration.
    const { resolve, reject, data } = this._promiseQueue.shift()
    try {
      resolve(this._run(data))
    } catch (error) {
      reject(error)
    }
  }

  async _run (data) {
    if (this._hasSequential) {
      // Run sequential part.
      data = await this.sequential(data)
    }

    // Try and shift to the next call.
    this._tryShift()

    if (this._hasConcurrent) {
      // Run concurrent part.
      data = await this.concurrent(data)
    }

    return data
  }

  /*
   * Methods to extends when using this as your base class.
   * async setup (app:Hoast) { }
   * async sequential (app:Hoast) { }
   * async concurrent (app:Hoast) { }
   */
}

export default BaseProcessor
