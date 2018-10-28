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
test(`modules`, function(t) {
	t.is(typeof(Hoast.read), `function`);
	
	// Alias path.
	const read = require(`../read`);
	t.is(typeof(read), `function`);
	t.deepEqual(Hoast.read, read);
});

// `helpers` functions.
test(`helpers`, function(t) {
	// Global
	t.is(typeof(Hoast.helpers), `object`);
	// Prototype.
	const hoast = Hoast(__dirname);
	t.is(typeof(hoast.helpers), `object`);
});

// Legacy `helper` functions.
test(`helper`, function(t) {
	// Global
	t.is(typeof(Hoast.helper), `object`);
	// Prototype.
	const hoast = Hoast(__dirname);
	t.is(typeof(hoast.helpers), `object`);
});