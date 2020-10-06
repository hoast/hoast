/**
 * Get a value from a source by a dot seperated path.
 * @param {Object} source The object to retrieve a value from.
 * @param {String} path Dot notation string with each segment a property on the source.
 * @returns {Any} Value at path.
 */
export const getByDotNotation = function (source, path) {
  return getByPathSegments(source, path.split('.'))
}

/**
 * Get a value from a source by an array seperated path.
 * @param {Object} source The object to retrieve a value from.
 * @param {Array<String>} path Array of strings with each segment a property on the source.
 * @returns {Any} Value at path.
 */
export const getByPathSegments = function (source, path) {
  return [...path].reduce((object, segment) => object[segment], source)
}

export default {
  getByDotNotation,
  getByPathSegments,
}
