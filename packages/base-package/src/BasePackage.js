// Import external modules.
import Logger from '@hoast/utils/Logger.js'
import deepAssign from '@hoast/utils/deepAssign.js'

class BasePackage {
  constructor(...options) {
    // Set initial options.
    this._options = deepAssign({
      logLevel: 2,
    }, ...options)

    // Create internal logger.
    this._logger = new Logger(this._options.logLevel, this.constructor.name)
  }
}

export default BasePackage
