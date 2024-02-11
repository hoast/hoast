// Import base modules.
import BasePackage from '@hoast/base-package'

// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'

class ProcessLog extends BasePackage {
  /**
   * Create package instance.
   * @param  {Object} options Options objects.
   */
  constructor(
    options,
  ) {
    super({
      property: null,

      format: 'js',
      level: 'info',

      prepend: null,
      append: null,
    }, options)
    options = this.getOptions()

    // Convert dot notation to path segments.
    if (options.property) {
      this._propertyPath = options.property.split('.')
    }
  }

  next (
    data,
  ) {
    const options = this.getOptions()

    const messages = []

    if (options.prepend) {
      messages.push(options.prepend)
    }

    const value = this._propertyPath ? getByPathSegments(data, this._propertyPath) : data

    switch (String.prototype.toLowerCase.call(options.format)) {
      default:
        this.getLogger().warn('Unknown value for option "format", falling back to "js".')
      case 'js':
        messages.push(value)
        break

      case 'json':
        messages.push(
          JSON.stringify(value, null, 2),
        )
        break
    }

    if (options.append) {
      messages.push(options.append)
    }

    switch (String.prototype.toLowerCase.call(options.level)) {
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
