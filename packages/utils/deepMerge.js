// Import internal modules.
import { isObject } from './is.js'

/**
 * Deeply assign a series of arrays and or objects properties together.
 * @param {Any} target Target to merge onto.
 * @param  {...Any} sources Sources to merge with.
 * @returns {Object} Target object with sources values merged.
 */
const deepMerge = function (target, ...sources) {
  if (!sources.length) {
    return target
  }
  const source = sources.shift()

  if (Array.isArray(source)) {
    if (Array.isArray(target)) {
      for (const item of source) {
        if (target.indexOf(item) < 0) {
          target.push(source)
        }
      }
    }
  } else if (isObject(source)) {
    if (isObject(target)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, {
              [key]: {},
            })
          }
          deepMerge(target[key], source[key])
        } else {
          Object.assign(target, {
            [key]: source[key],
          })
        }
      }
    }
  }

  return deepMerge(target, ...sources)
}

export default deepMerge
