const prepareModule = function(lookup, data, defaultKey) {
  let module, options

  // If array split options from module.
  if (Array.isArray(module)) {
    module = data.shift()
    options = data
  } else {
    module = data
    options = []
  }

  // If string fetch from lookup.
  if (typeof (module) === 'string') {
    module = lookup[module]
  }

  // If function wrap it.
  if (typeof (module) === 'function') {
    module = {
      [defaultKey]: module,
    }
  }

  return {
    module,
    options,
  }
}

export const prepareProcess = function(lookup, data) {
  return prepareModule(lookup, data, 'process')
}

export const prepareSource = function(lookup, data) {
  return prepareModule(lookup, data, 'iterator')
}

export default {
  prepareProcess,
  prepareSource,
}
