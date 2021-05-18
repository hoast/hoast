import { isClass } from './is.js'

/**
 * Instantiate a value. If the value is an array the first item is assumed to be the value and the others become parameters given to the constructor.
 * @param {Any} value Value to import and or instantiate. A string will be dynamically imported.
 * @returns {Object} The imported and instantiated object.
 */
const instantiate = async function (value) {
  let result, parameters
  if (Array.isArray(value)) {
    result = value.shift()
    parameters = value
  } else {
    result = value
    parameters = []
  }

  // Get type of result.
  let type = typeof (result)

  // Import as package if string.
  if (type === 'string') {
    result = await import(result)
    if (result.default) {
      result = result.default
    }

    // Get type of imported.
    type = typeof (result)

    // Check new value.
    if (type !== 'function') {
      throw new Error('Imported type must be a class or function.')
    }
  }

  // Instantiate result.
  if (type === 'function') {
    if (isClass(result)) {
      result = new result(...parameters) // eslint-disable-line new-cap
    } else {
      result = result(...parameters)
    }
  }

  return result
}

export default instantiate
