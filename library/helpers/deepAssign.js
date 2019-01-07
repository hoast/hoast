/**
 * Check whether the value is an object.
 * @param {Any} value Value of unknown type.
 * @returns Whether the value is an object. 
 */
const isObject = function(value) {
	return (value && typeof value === `object` && !Array.isArray(value));
};

/**
 * Deeply assign a series of objects properties together.
 * @param {Object} target Target object to merge to.
 * @param  {...Object} sources Objects to merge into the target.
 */
const deepAssign = function(target, ...sources) {
	if (!sources.length) {
		return target;
	}
	const source = sources.shift();
	
	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) {
					Object.assign(target, {
						[key]: {}
					});
				}
				deepAssign(target[key], source[key]);
			} else if(source[key] !== undefined) {
				target[key] = source[key];
			}
		}
	}
	
	return deepAssign(target, ...sources);
};

module.exports = deepAssign;