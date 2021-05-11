/**
 * Logger class useful for only allowing messages to be send to the console of the right level is set.
 */
class Logger {
  /**
   * Create logger instance.
   * @param {Number} level Log level.
   * @param {String} prefix Prefix of logged messages.
   */
  constructor(level = 2, prefix = undefined) {
    this.setLevel(level)
    this.setPrefix(prefix)
  }

  // Option setters and getters.

  /**
   * Get log level value.
   * @returns {Number} log level value.
   */
  getlevel () {
    return this._level
  }

  /**
   * Set log level value.
   * @param {Number} level Log level value.
   */
  setLevel (level) {
    if (level !== null && level !== undefined && typeof (level) !== 'number') {
      throw new Error('Log level value not of type number.')
    }

    this._level = level
  }

  /**
   * Get log prefix value.
   * @returns {String} Log prefix value.
   */
  getPrefix () {
    return this._prefix
  }

  /**
   * Set log prefix value.
   * @param {Number} prefix Log prefix value.
   */
  setPrefix (prefix) {
    if (prefix !== null && prefix !== undefined && typeof (prefix) !== 'string') {
      throw new Error('Log prefix value not of type string.')
    }

    this._prefix = prefix
  }

  // Logging functions.

  /**
   * Undocumented alias for `info` function.
   */
  log (parameters) {
    return this.info(...parameters)
  }

  /**
   * Logs info message to console if level is greater than 2.
   * @param {String} message Message to output.
   * @param  {...Any} optionalParams Additional optional parameters.
   */
  info (message, ...optionalParams) {
    if (this._level < 3) {
      return
    }

    if (this.getPrefix()) {
      message = `${this.getPrefix()}: ${message}`
    }

    console.log(message, ...optionalParams)
  }

  /**
   * Logs warning message to console if level is greater than 1.
   * @param {String} message Message to output.
   * @param  {...Any} optionalParams Additional optional parameters.
   */
  warn (message, ...optionalParams) {
    if (this._level < 2) {
      return
    }

    if (this.getPrefix()) {
      message = `${this.getPrefix()}: ${message}`
    }

    console.warn(message, ...optionalParams)
  }

  /**
   * Logs error message to console if level is greater than 1.
   * @param {String} message Message to output.
   * @param  {...Any} optionalParams Additional optional parameters.
   */
  error (message, ...optionalParams) {
    if (this._level < 1) {
      return
    }

    if (this.getPrefix()) {
      message = `${this.getPrefix()}: ${message}`
    }

    console.error(message, ...optionalParams)
  }

  /**
   * Logs trace to console.
   * @param {String} message Message to output.
   * @param  {...Any} optionalParams Additional optional parameters.
   */
  trace (message, ...optionalParams) {
    if (this.getPrefix()) {
      message = `${this.getPrefix()}: ${message}`
    }

    console.trace(message, ...optionalParams)
  }
}

export default Logger
