class Debugger {
  constructor(level = 2) {
    this.setLevel(level)
  }

  setLevel (level) {
    this.level = level
  }

  log (...parameters) {
    this.info(...parameters)
  }

  info (message, ...optionalParams) {
    if (this.level < 3) {
      return
    }

    console.log(message, ...optionalParams)
  }

  warn (message, ...optionalParams) {
    if (this.level < 2) {
      return
    }

    console.warn(message, ...optionalParams)
  }

  error (message, ...optionalParams) {
    if (this.level < 1) {
      return
    }

    console.error(message, ...optionalParams)
  }
}

export default Debugger
