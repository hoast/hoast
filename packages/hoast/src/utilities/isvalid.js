export const isValidModule = function(module, requiredProperties = []) {
  if (Array.isArray(module)) {
    module = module[0]
  }

  const moduleType = typeof (module)

  if (moduleType !== 'object') {
    if (moduleType !== 'function') {
      return false
    }
  } else {
    for (const propertyKey in requiredProperties) {
      if (!Object.prototype.hasOwnProperty.call(module, propertyKey)) {
        return false
      }
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
