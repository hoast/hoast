// Import base class.
import BasePackage from '@hoast/base-package'

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
        all: false,
        array: 'any', // all, any, first, last.
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
    if (this._options.filterCustom) {
      // Skip if custom methods returns false.
      if (!this._options.filterCustom(data)) {
        return data
      }
    } else if (this._filterExpressions) {
      // Get value at filter property.
      let value = getByPathSegments(data, this._filterPropertyPath)
      let matches

      // If array then check the filter over each item.
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return data
        }

        switch (String.prototype.toLowerCase.call(this._options.filterOptions.array)) {
          case 'all':
            // All should match.
            for (const valueItem of value) {
              matches = this._options.filterOptions.all ? planckmatch.match.all(valueItem, this._filterExpressions) : planckmatch.match.any(valueItem, this._filterExpressions)
              if (!matches) {
                return data
              }
            }
            break

          case 'any':
            // Any should match.
            let match = false
            for (const valueItem of value) {
              matches = this._options.filterOptions.all ? planckmatch.match.all(valueItem, this._filterExpressions) : planckmatch.match.any(valueItem, this._filterExpressions)
              if (matches) {
                match = true
                break
              }
            }
            if (!match) {
              return data
            }
            break

          case 'first':
            // First should match.
            value = value[0]
            matches = this._options.filterOptions.all ? planckmatch.match.all(value, this._filterExpressions) : planckmatch.match.any(value, this._filterExpressions)
            if (!matches) {
              return data
            }
            break

          case 'last':
            // Last should match.
            value = value[value.length - 1]
            matches = this._options.filterOptions.all ? planckmatch.match.all(value, this._filterExpressions) : planckmatch.match.any(value, this._filterExpressions)
            if (!matches) {
              return data
            }
            break
        }
      } else if (typeof (value) === 'string') {
        // Match agains value.
        matches = this._options.filterOptions.all ? planckmatch.match.all(value, this._filterExpressions) : planckmatch.match.any(value, this._filterExpressions)
        if (!matches) {
          return data
        }
      } else {
        // Check truthiness.
        if (!value) {
          return data
        }
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
   * async initialize () { }
   * async sequential (data):data { }
   * async concurrent (data):data { }
   */
}

export default BaseProcessor
