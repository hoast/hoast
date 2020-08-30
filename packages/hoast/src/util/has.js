export const hasKeys = function (value, requiredProperties = []) {
  // Check if module is an object.
  const moduleType = typeof (value)
  if (moduleType !== 'object') {
    return false
  }

  // Check if object has all required properties.
  for (const propertyKey in requiredProperties) {
    if (!Object.prototype.hasOwnProperty.call(value, propertyKey)) {
      return false
    }
  }

  return true
}

export default {
  hasKeys,
}
