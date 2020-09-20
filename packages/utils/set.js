/**
 * Set a value on a target by a dot seperated path.
 * @param {Object} target Target object to set value to.
 * @param {String} path Dot notation string with each segment a property on the target.
 * @param {Any} value The value to set at the path on the target.
 */
export const setByDotNotation = function (target, path, value) {
  // Split path and return result from setByPathSegments.
  return setByPathSegments(target, path.split('.'), value)
}

/**
 * Set a value on a target by an array seperated path.
 * @param {Object} target Target object to set value to.
 * @param {Array<String>} path Array of strings with each segment a property on the target.
 * @param {Any} value The value to set at the path on the target.
 */
export const setByPathSegments = function (target, path, value) {
  // Ensure target is an object.
  if (typeof (target) !== 'object') {
    target = {}
  }

  [...path].reduce((object, segment, index) => {
    if (index === path.length - 1) {
      object[segment] = value
      return
    } else if (!object[segment] || typeof (object[segment]) !== 'object') {
      object[segment] = {}
    }

    return object[segment]
  }, target)

  return target
}

export default {
  setByDotNotation,
  setByPathSegments,
}
