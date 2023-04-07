/**
 * Get a value from a source by a dot separated path.
 * @param {Object} source The object to retrieve a value from.
 * @param {String} path Dot notation string with each segment a property on the source.
 * @returns {Any} Value at path.
 */
export const getByDotNotation = function (source, path) {
  return getByPathSegments(source, path.split('.'))
}

/**
 * Get a value from a source by an array separated path.
 * @param {Object} source The object to retrieve a value from.
 * @param {Array<String>} path Array of strings with each segment a property on the source.
 * @returns {Any} Value at path.
 */
export const getByPathSegments = function (source, path) {
  if (!path || path.length === 0) {
    return source
  }
  path = [...path]
  let segment = path.shift()

  if (segment[0] === '[' && segment[segment.length - 1] === ']') {
    segment = segment.substring(1, segment.length - 1)

    // Return list of items instead of a single one.
    if (segment === '' && Array.isArray(source)) {
      return source.map(item => getByPathSegments(item, path))
    }
  }

  if (!(segment in source)) {
    return undefined
  }
  return getByPathSegments(source[segment], path)
}

export default {
  getByDotNotation,
  getByPathSegments,
}
