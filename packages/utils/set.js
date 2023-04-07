/**
 * Set a value on a target by a dot separated path.
 * @param {Object} target Target object to set value to.
 * @param {String} path Dot notation string with each segment a property on the target.
 * @param {Any} value The value to set at the path on the target.
 * @returns {Object} Target object with the value set to it.
 */
export const setByDotNotation = function (target, path, value) {
  // Split path and return result from setByPathSegments.
  return setByPathSegments(target, path.split('.'), value)
}

/**
 * Set a value on a target by an array separated path.
 * @param {Object} target Target object to set value to.
 * @param {Array<String>} path Array of strings with each segment a property on the target.
 * @param {Any} value The value to set at the path on the target.
 * @returns {Object} Target object with the value set to it.
 */
export const setByPathSegments = function (target, path, value) {
  if (!path || path.length === 0) {
    return target
  }
  path = [...path]
  let segment = path.shift()

  if (segment[0] === '[' && segment[segment.length - 1] === ']') {
    segment = segment.substring(1, segment.length - 1)

    if (segment === '') {
      if (!target || !Array.isArray(target)) {
        target = []
      }

      if (path.length === 0) {
        target.splice(0, value.length)
        for (let i = value.length - 1; i >= 0; i--) {
          target.unshift(value[i])
        }
      } else {
        for (let i = 0; i < value.length; i++) {
          target[i] = setByPathSegments(target[i], path, value[i])
        }
      }

      return target
    }
  }

  if (!target) {
    target = {}
  }
  if (path.length === 0) {
    target[segment] = value
  } else {
    target[segment] = setByPathSegments(target[segment], path, value)
  }

  return target
}

export default {
  setByDotNotation,
  setByPathSegments,
}
