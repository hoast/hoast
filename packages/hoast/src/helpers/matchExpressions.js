// Dependency modules
const _match = require('planckmatch/match')

/**
 * Check if expressions match with the given value.
 * @param {string} value String to match with the expressions.
 * @param {RegExps|RegExp[]} expressions Regular expressions to match with.
 * @param {boolean} all Whether all patterns need to match.
 */
const match = function(value, expressions, all = false) {
  // If no expressions return early as valid.
  if (!expressions || (Array.isArray(expressions) && expressions.length === 0)) {
    return true
  }

  // Check whether all or just any will result in a match, and return the outcome.
  return all ? _match.all(value, expressions) : _match.any(value, expressions)
}

module.exports = match
