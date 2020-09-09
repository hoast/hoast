// Import internal modules.
import Debugger from './Debugger.js'
import deepAssign from './deepAssign.js'

class BasePackage {
  constructor(defaultOptions, options) {
    // Set initial options.
    this._options = deepAssign({
      debugLevel: 2,
    }, defaultOptions, options)

    // Create internal debugger.
    this._debugger = new Debugger(this._options.debugLevel)
  }

  /**
   * deepAssigns given optiosn with existing options.
   * @param {Object} options
   */
  setOptions (options) {
    // deepAssign new over current options.
    this._options = deepAssign(this._options, options)

    // Set debugger level.
    this._debugger.setLevel(this._options.debugLevel)
  }

  /**
   * Get the current options.
   * @returns {Object} Current options.
   */
  getOptions () {
    return this._options
  }
}

export default BasePackage
