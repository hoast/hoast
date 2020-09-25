// Import base modules.
import BasePackage from '@hoast/base-package'

// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'

class ProcessLog extends BasePackage {
  constructor(options) {
    super({
      property: null,

      format: 'js',
      level: 'log',

      prepend: null,
      append: null,
    }, options)

    // Convert dot notation to path segments.
    if (this._options.property) {
      this._propertyPath = this._options.property.split('.')
    }
  }

  next (data) {
    const messages = []

    if (this._options.prepend) {
      messages.push(this._options.prepend)
    }

    const value = this._propertyPath ? getByPathSegments(data, this._propertyPath) : data

    switch (String.prototype.toLowerCase.call(this._options.format)) {
      default:
        this._logger.warn('Unkown value for option "format", falling back to "js".')
      case 'js':
        messages.push(value)
        break

      case 'json':
        messages.push(
          JSON.stringify(value, null, 2)
        )
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

export default ProcessLog
