// Dependency modules.
const test = require(`ava`);
// Custom module.
const Hoast = require(`../library`);

// Core functions.
test(`core`, function(t) {
	t.is(typeof(Hoast), `function`);
	
	// Instance.
	const hoast = Hoast(__dirname);
	t.is(typeof(hoast.use), `function`);
	t.is(typeof(hoast.process), `function`);
	
	// Default options
	const options = {
		source: `source`,
		destination: `destination`,
		
		remove: false,
		patterns: [],
		patternOptions: {},
		concurrency: Infinity,
		
		metadata: {}
	};
	t.deepEqual(hoast.options, options);
});

// Build-in modules.
test(`build-in`, function(t) {
	t.is(typeof(Hoast.read), `function`);
	
	// Alias path.
	const read = require(`../read`);
	t.is(typeof(read), `function`);
	t.deepEqual(Hoast.read, read);
});

// Helpers functions.
test(`helpers`, function(t) {
	t.is(typeof(Hoast.helpers), `object`);
	
	t.is(typeof(Hoast.helpers.createDirectory), `function`);
	t.is(typeof(Hoast.helpers.parsePatterns), `function`);
	t.is(typeof(Hoast.helpers.matchExpressions), `function`);
	t.is(typeof(Hoast.helpers.removeFiles), `function`);
	t.is(typeof(Hoast.helpers.scanDirectory), `function`);
	t.is(typeof(Hoast.helpers.writeFiles), `function`);
});

test(`helper-legacy`, function(t) {
	t.is(typeof(Hoast.helper), `object`);
	
	t.is(typeof(Hoast.helper.createDirectory), `function`);
	t.is(typeof(Hoast.helper.parse), `function`);
	t.is(typeof(Hoast.helper.match), `function`);
	t.is(typeof(Hoast.helper.remove), `function`);
	t.is(typeof(Hoast.helper.scanDirectory), `function`);
	t.is(typeof(Hoast.helper.writeFiles), `function`);
});