class Logger {
  constructor(level = 2, prefix = undefined) {
    this.setLevel(level)
    this.setPrefix(prefix)
  }

  // Option setters and getters.

  getlevel () {
    return this._level
  }

  setLevel (level) {
    this._level = level
  }

  getPrefix () {
    return this._prefix
  }

  setPrefix (prefix) {
    this._prefix = prefix
  }

  // Messaging methods.

  log (parameters) {
    this.info(...parameters)
  }

  info (message, ...optionalParams) {
    if (this._level < 3) {
      return
    }

    if (this.getPrefix()) {
      message = `${this.getPrefix()}: ${message}`
    }

    console.log(message, ...optionalParams)
  }

  warn (message, ...optionalParams) {
    if (this._level < 2) {
      return
    }

    if (this.getPrefix()) {
      message = `${this.getPrefix()}: ${message}`
    }

    console.warn(message, ...optionalParams)
  }

  error (message, ...optionalParams) {
    if (this._level < 1) {
      return
    }

    if (this.getPrefix()) {
      message = `${this.getPrefix()}: ${message}`
    }

    console.error(message, ...optionalParams)
  }

  trace (message, ...optionalParams) {
    if (this.getPrefix()) {
      message = `${this.getPrefix()}: ${message}`
    }

    console.trace(message, ...optionalParams)
  }
}

export default Logger
