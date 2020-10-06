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

  /**
   * Set app reference. This will be called by hoast itself before the next function is called.
   * @param {Object} app Hoast instance.
   */
  _setApp (app) {
    this._app = app
  }
}

export default BasePackage
