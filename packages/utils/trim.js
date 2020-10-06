/**
 * Trim a specific character from the start of a string.
 * @param {String} string String to trim.
 * @param {String} character Character to trim.
 * @returns {String} Trimmed string.
 */
export const trimStart = function (string, character) {
  if (character === ']') {
    character = '\\]'
  } else if (character === '\\') {
    character = '\\\\'
  }

  return string.replace(new RegExp('^[' + character + ']', 'g'), '')
}

/**
 * Trim a specific character from the start and end of a string.
 * @param {String} string String to trim.
 * @param {String} character Character to trim.
 * @returns {String} Trimmed string.
 */
export const trim = function (string, character) {
  if (character === ']') {
    character = '\\]'
  } else if (character === '\\') {
    character = '\\\\'
  }

  return string.replace(new RegExp('^[' + character + ']+|[' + character + ']+$', 'g'), '')
}

/**
 * Trim a specific character from the end of a string.
 * @param {String} string String to trim.
 * @param {String} character Character to trim.
 * @returns {String} Trimmed string.
 */
export const trimEnd = function (string, character) {
  if (character === ']') {
    character = '\\]'
  } else if (character === '\\') {
    character = '\\\\'
  }

  return string.replace(new RegExp('[' + character + ']$', 'g'), '')
}

export default {
  trimStart,
  trim,
  trimEnd,
}
