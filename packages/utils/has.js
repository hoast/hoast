export const hasKeys = function (value, requiredProperties = []) {
  // Check if module is an object.
  const moduleType = typeof (value)
  if (moduleType !== 'object') {
    return false
  }

  // Check if object has all required properties.
  for (const propertyName of requiredProperties) {
    if (!Object.prototype.hasOwnProperty.call(value, propertyName)) {
      return false
    }
  }

  return true
}

export default {
  hasKeys,
}
