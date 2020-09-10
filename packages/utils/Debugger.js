class Debugger {
  constructor(level = 2) {
    this.setLevel(level)
  }

  getlevel () {
    return this._level
  }

  setLevel (level) {
    this._level = level
  }

  log (message, ...optionalParams) {
    if (this._level < 3) {
      return
    }

    console.log(message, ...optionalParams)
  }

  info (parameters) {
    this.log(...parameters)
  }

  warn (message, ...optionalParams) {
    if (this._level < 2) {
      return
    }

    console.warn(message, ...optionalParams)
  }

  error (message, ...optionalParams) {
    if (this._level < 1) {
      return
    }

    console.error(message, ...optionalParams)
  }
}

export default Debugger
