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
      patterns: null,
      patternOptions: {},
      patternField: null,
    }, ...options)

    this._isInitialized = false
    this._holdCalls = false
    this._promiseQueue = []

    // Parse patterns into regular expressions.
    if (this._options.patterns && this._options.patterns.length > 0) {
      if (!this._options.patternField) {
        this._logger.error('Required option "patternField" not set. See documention for more infromation.')
      }

      this._expressions = this._options.patterns.map(pattern => {
        return planckmatch.parse(pattern, this._options.patternOptions, this._options.patternOptions.isPath)
      })

      this._expressionFieldPath = this._options.patternField.split('.')
    }
  }

  async next (app, data) {
    // Exit early now if filtered out.
    if (this._expressions) {
      const value = getByPathSegments(data, this._expressionFieldPath)
      const matches = this._options.patternOptions.all ? planckmatch.match.all(value, this._expressions) : planckmatch.match.any(value, this._expressions)
      if (!matches) {
        return data
      }
    }

    // Initialize if not initialized already.
    if (!this._isInitialized && typeof (this.setup) === 'function') {
      if (this._holdCalls) {
        // Add calls to queue.
        return await new Promise((resolve, reject) => {
          this._promiseQueue.push({
            resolve,
            reject,
            app,
            data,
          })
        })
      }
      this._holdCalls = true

      // If setup exist invoke it.
      await this.setup(app)

      // Set state variables.
      this._isInitialized = true
      this._holdCalls = false

      // Release held calls.
      for (const { resolve, reject, app, data } of this._promiseQueue) {
        try {
          resolve(this.process(app, data))
        } catch (error) {
          reject(error)
        }
      }
      this._promiseQueue = []
    }

    // Run process.
    return await this.process(app, data)
  }

  /*
   * Methods to extends when using this as your base class.
   * async setup (app) { }
   * async process (app, data) { }
   */
}

export default BaseProcessor
