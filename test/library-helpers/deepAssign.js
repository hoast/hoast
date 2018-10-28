// Dependency modules.
const test = require(`ava`);
// Custom module.
const Hoast = require(`../../library`);
const hoast = Hoast(__dirname);

test(`type`, function(t) {
	t.is(typeof(Hoast.helpers.deepAssign), `function`);
	t.is(typeof(hoast.helpers.deepAssign), `function`);
	t.is(Hoast.helpers.deepAssign, hoast.helpers.deepAssign);
});

test(`function`, function(t) {
	// Return modified primary object.
	const object = {};
	t.is(Hoast.helpers.deepAssign(object), object);
	t.is(Hoast.helpers.deepAssign(object, {}), object);
	t.not(Hoast.helpers.deepAssign({}, object), object);
	
	// Assign.
	t.deepEqual(Hoast.helpers.deepAssign({
		a: `a`
	}, {}), {
		a: `a`
	});
	t.deepEqual(Hoast.helpers.deepAssign({}, {
		a: `a`
	}), {
		a: `a`
	});
	
	// Assign deep.
	t.deepEqual(Hoast.helpers.deepAssign({
		a: {
			b: `b`
		}
	}, {}), {
		a: {
			b: `b`
		}
	});
	t.deepEqual(Hoast.helpers.deepAssign({}, {
		a: {
			b: `b`
		}
	}), {
		a: {
			b: `b`
		}
	});
	
	// Merge.
	t.deepEqual(Hoast.helpers.deepAssign({
		a: `a`
	}, {
		b: `b`
	}), {
		a: `a`,
		b: `b`
	});
	
	// Merge deep.
	t.deepEqual(Hoast.helpers.deepAssign({
		a: {
			b: `b`
		}
	}, {
		a: {
			c: `c`
		}
	}), {
		a: {
			b: `b`,
			c: `c`
		}
	});
	
	// Overwrite.
	t.deepEqual(Hoast.helpers.deepAssign({
		a: `a`
	}, {
		a: `b`
	}), {
		a: `b`
	});
	
	// Overwrite deep.
	t.deepEqual(Hoast.helpers.deepAssign({
		a: {
			b: `b`
		}
	}, {
		a: {
			b: `c`
		}
	}), {
		a: {
			b: `c`
		}
	});
	
	// Multiple
	t.deepEqual(Hoast.helpers.deepAssign({
		a: `a`
	}, {
		b: `b`
	}, {
		c: `c`
	}), {
		a: `a`,
		b: `b`,
		c: `c`
	});
	
	// Invalid parameters.
	t.deepEqual(Hoast.helpers.deepAssign(1), 1);
	t.deepEqual(Hoast.helpers.deepAssign(1, 2), 1);
	t.deepEqual(Hoast.helpers.deepAssign({}, 2), {});
	t.deepEqual(Hoast.helpers.deepAssign({
		a: `a`
	}, 2, {
		b: `b`
	}), {
		a: `a`,
		b: `b`
	});
});