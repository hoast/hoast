// Import external modules.
import Logger from '@hoast/utils/Logger.js'
import deepAssign from '@hoast/utils/deepAssign.js'

class BasePackage {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(...options) {
    // Set initial options.
    this._options = deepAssign({
      logLevel: 2,
    }, ...options)

    // Create internal logger.
    this._logger = new Logger(this._options.logLevel, this.constructor.name)
  }

  getOptions () {
    return this._options
  }

  getLibrary () {
    return this._library
  }

  /**
   * Set library reference. This will be called by hoast itself before the next function is called.
   * @param {Object} library Hoast instance.
   */
  setLibrary (library) {
    if (this._library && this._library !== library) {
      this._logger.error('Different library already set on plugin. Don\'t re-use plugins on multiple instances.')
      return
    }

    this._library = library
  }

  getLogger () {
    return this._logger
  }
}

export default BasePackage
