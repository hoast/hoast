import BaseProcess from '@hoast/base-process'

import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'
import { isClass } from '@hoast/utils/is.js'

class ProcessJavascript extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      executeProperty: 'contents', // The property to find the exacutable content on.
      execute: { // Set to false to disable code execution.
        functionNames: [''], // Array of functions to call.
        setProperty: 'contents', // Where to write the function call's returned data to.
      },

      importProperty: 'path', // The property to find the file to import from.
      import: { // Set to false to disable importing.
        extractName: 'default', // The name of the item to import from the imported code.
        setProperty: 'contents',
      },
    }, options)

    // Convert dot notation to path segments.
    if (this._options.executeProperty) {
      this._executePropertyPath = this._options.executeProperty.split('.')
    }
    if (this._options.execute && this._options.execute.setProperty) {
      this._executeSetPropertyPath = this._options.execute.setProperty.split('.')
    }
    if (this._options.importProperty) {
      this._importPropertyPath = this._options.importProperty.split('.')
    }
    if (this._options.import && this._options.import.setProperty) {
      this._importSetPropertyPath = this._options.import.setProperty.split('.')
    }
  }

  async concurrent (data) {
    let value

    // Dynamically import code.
    if (this._importPropertyPath) {
      // Get path from data.
      const importValue = getByPathSegments(data, this._importPropertyPath)
      try {
        // Import value at path.
        value = await import(importValue)

        // Deconstruct imported value.
        if (this._options.extractName) {
          value = getByPathSegments(value, this._options.extractName)

          if (!value) {
            this._logger.warn('Unable to deconstruct imported code.')
            return data
          }
        }

        // Set value back to data object.
        if (this._importSetPropertyPath) {
          data = setByPathSegments(data, this._importSetPropertyPath, value)
        }
      } catch (error) {
        this._logger.warn('Unable to import file at path: "' + importValue + '".')
        return data
      }
    }

    // Get executable code from exising object.
    if (!value && this._executePropertyPath) {
      value = getByPathSegments(data, this._executePropertyPath)

      if (!value) {
        this._logger.warn('Unable to retrieve an executable value or propert')
        return data
      }
    }

    // Iterate over function names.
    for (const functionName of this._options.execute.functionNames) {
      // Deconstruct if function name is given.
      if (functionName && functionName !== '') {
        value = value[functionName]
      }

      // Check if variable can be called.
      if (typeof (value) !== 'function') {
        this._logger.error('Value not of type function or class')
        return data
      }

      // If class then invoke as new otherwise call it as a function.
      if (isClass(value)) {
        value = new value(data) // eslint-disable-line new-cap
      } else {
        value = value(data)
      }
    }

    // Write value back to data.
    if (this._executeSetPropertyPath) {
      data = setByPathSegments(data, this._executeSetPropertyPath, value)
    }

    return data
  }
}

export default ProcessJavascript
