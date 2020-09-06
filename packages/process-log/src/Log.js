class Log {
  constructor(options) {
    this._options = Object.assign({
      format: 'json',
      level: 'log',

      prepend: null,
      append: null,
    }, options)
  }

  process (app, data) {
    const messages = []

    if (this._options.prepend) {
      messages.push(this._options.prepend)
    }

    switch (String.prototype.toLowerCase.call(this._options.format)) {
      default:
      case 'json':
        messages.push(JSON.stringify({
          app,
          data,
        }, null, 2))
        break

      case 'js':
        messages.push({
          app,
          data,
        })
        break
    }

    if (this._options.append) {
      messages.push(this._options.append)
    }

    switch (String.prototype.toLowerCase.call(this._options.level)) {
      case 'error':
        console.error(...messages)
        break

      default:
      case 'info':
      case 'log':
        console.log(...messages)
        break

      case 'warn':
        console.warn(...messages)
        break
    }
  }
}

export default Log