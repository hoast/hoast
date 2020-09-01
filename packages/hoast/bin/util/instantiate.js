/**
 * Instantiate a value. If the value is an array the first item is assumed to be the value and the others become arguments given to the constructor.
 * @param {Any} value Value to import and or instantiate. A string will be dynamically imported.
 */
const instantiate = async function (value) {
  let result, arguments
  if (Array.isArray(value)) {
    result = value.shift()
    arguments = value
  } else {
    result = value
    arguments = []
  }

  // Get type of result.
  let type = typeof (result)

  // Import as package if string.
  if (type === 'string') {
    result = await import(result)

    // Get type of imported.
    type = typeof (result)

    // Check new value.
    if (type !== 'function') {
      throw new Error('Imported type must be a class or function. ')
    }
  }

  // Instantiate result.
  if (type === 'function') {
    if (isClass(result)) {
      result = new result(...arguments);
    } else {
      result = result(...arguments)
    }
  }

  return result
}

export default instantiate
