// Import internal modules.
import { isObject } from './is.js'

/**
 * Deeply assign a series of objects properties together.
 * @param {Object} target Target object to assign onto.
 * @param  {...Object} sources Sources to assign with.
 * @returns {Object} Target object with sources values assigned.
 */
const deepAssign = function (target, ...sources) {
  if (!sources.length) {
    return target
  }
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, {
            [key]: {},
          })
        }
        deepAssign(target[key], source[key])
      } else {
        Object.assign(target, {
          [key]: source[key],
        })
      }
    }
  }

  return deepAssign(target, ...sources)
}

export default deepAssign
