const prepareModule = function(lookup, data) {
  let module, options

  // If array split options from module.
  if (Array.isArray(module)) {
    module = data.shift()
    options = data
  } else {
    module = data
    options = []
  }

  // Get module from lookup table.
  if (typeof (module) === 'string') {
    module = lookup[module]
  }

  return {
    module,
    options,
  }
}

export default {
  prepareModule,
}
