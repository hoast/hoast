// Import base class.
import BasePackage from '@hoast/base-package.js'

// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import planckmatch from 'planckmatch'

/**
 * Adds initialize method to processors and pattern filtering.
 */
class BaseProcessor extends BasePackage {
  constructor(...options) {
    super({
      filterCustom: null,
      filterPatterns: null,
      filterProperty: null,
      filterOptions: {
        // Which item(s) to check if the field value is an array.
        array: 'first', // first, last, all, any.
      },
    }, ...options)

    this._hasInitialize = typeof (this.initialize) === 'function'
    this._hasSequential = typeof (this.sequential) === 'function'
    this._hasConcurrent = typeof (this.concurrent) === 'function'

    if (this._hasInitialize) {
      this._isInitialized = false
    }
    if (this._hasInitialize || this._hasSequential) {
      this._holdCalls = false
      this._promiseQueue = []
    }

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
        this.hold = false
      }
    }

    if (this._hasConcurrent) {
      // Run concurrent part.
      data = await this.concurrent(data)
    }

    return data
  }

  /*
   * Methods to use when using this as your base class.
   * async initialize (data) { }
   * async sequential (data) { }
   * async concurrent (data) { }
   */
}

export default BaseProcessor
