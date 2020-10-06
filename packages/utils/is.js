/**
 * Checks if value is a class.
 * @param {Any} value Value to check.
 * @returns {Boolean} Whether the value is a class.
 */
export const isClass = function (value) {
  const isConstructorOrClass = value.constructor && value.constructor.toString().substring(0, 5) === 'class'
  if (value.prototype === undefined) {
    return isConstructorOrClass
  }
  const prototypeIsConstructorOrClass = (value.prototype.constructor && value.prototype.constructor.toString && value.prototype.constructor.toString().substring(0, 5) === 'class')
  return isConstructorOrClass || prototypeIsConstructorOrClass
}

/**
 * Check whether the value is an object.
 * @param {Any} value Value of unknown type.
 * @returns {Boolean} Whether the value is an object.
 */
export const isObject = function (value) {
  return (value && typeof value === 'object' && !Array.isArray(value))
}

export default {
  isClass,
  isObject,
}
