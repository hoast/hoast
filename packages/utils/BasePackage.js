// Import internal modules.
import Logger from './Logger.js'
import deepAssign from './deepAssign.js'

class BasePackage {
  constructor(defaultOptions, options) {
    // Set initial options.
    this._options = deepAssign({
      logLevel: 2,
    }, defaultOptions, options)

    // Create internal logger.
    this._logger = new Logger(this._options.logLevel, this.constructor.name)
  }
}

export default BasePackage
