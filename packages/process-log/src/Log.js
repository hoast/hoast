import BasePackage from '@hoast/utils/BasePackage.js'

class Log extends BasePackage {
  constructor(options) {
    super({
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
        this._debugger.warn('Unkown value for option "format", falling back to "json".')

      case 'json':
        messages.push(JSON.stringify({
          meta: app.meta,
          data: data,
        }, null, 2))
        break

      case 'js':
        messages.push({
          meta: app.meta,
          data: data,
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

    // Return data as is.
    return data
  }
}

export default Log
