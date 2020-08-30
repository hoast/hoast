export const isValidModule = function(module, requiredProperties = []) {
  // If array get first value as module.
  if (Array.isArray(module)) {
    module = module[0]
  }

  // Check if module is an object.
  const moduleType = typeof (module)
  if (moduleType !== 'object') {
    return false
  }

  // Check if object has all required properties.
  for (const propertyKey in requiredProperties) {
    if (!Object.prototype.hasOwnProperty.call(module, propertyKey)) {
      return false
    }
  }

  return true
}

export const isValidProcess = function(data) {
  return isValidModule(data, ['process'])
}

export const isValidSource = function(data) {
  return isValidModule(data, ['iterator'])
}

export default {
  isValidProcess,
  isValidSource,
}
