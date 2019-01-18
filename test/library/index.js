// Dependency modules.
const test = require(`ava`);
// Custom module.
const Hoast = require(`../../library`);

test(`function check`, function(t) {
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

test(`build-in modules`, function(t) {
	// Global
	t.is(typeof(Hoast.read), `function`);
});

test(`helpers`, function(t) {
	// Global
	t.is(typeof(Hoast.helpers), `object`);
	// Prototype.
	const hoast = Hoast(__dirname);
	t.is(typeof(hoast.helpers), `object`);
});

test(`helper (legacy)`, function(t) {
	// Global
	t.is(typeof(Hoast.helper), `object`);
	// Prototype.
	const hoast = Hoast(__dirname);
	t.is(typeof(hoast.helpers), `object`);
});