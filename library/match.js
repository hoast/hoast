// Dependency modules
const _match = require(`planckmatch/match`);

/**
 * Check if expressions match with the given value.
 * @param {String} value String to match with the expressions.
 * @param {RegExps|Array} expressions Regular expressions to match with.
 * @param {Boolean} all Whether all patterns need to match.
 */
const match = function(value, expressions, all = false) {
	// If no expressions return early as valid.
	if (!expressions || expressions.length === 0) {
		return true;
	}
	
	const result = _match(value, expressions);
	
	// If results is an array.
	if (Array.isArray(result)) {
		// Check whether all or just any will result in a match, and return the outcome.
		return all ? !result.includes(false) : result.includes(true);
	}
	
	// Otherwise result is a boolean and can be returned directly.
	return result;
};

module.exports = match;