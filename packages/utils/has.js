/**
 * Check if an object has the required properties.
 * @param {Object} value Value to check.
 * @param {Array} propertyNames Array of property names.
 * @returns {Boolean} Whether the value is an object and the properties exist.
 */
export const hasProperties = function (value, propertyNames) {
  // Check if module is an object.
  const moduleType = typeof (value)
  if (moduleType !== 'object') {
    return false
  }

  // Check if object has all required properties.
  for (const propertyName of propertyNames) {
    if (!Object.prototype.hasOwnProperty.call(value, propertyName)) {
      return false
    }
  }

  return true
}

export default {
  hasProperties,
}
