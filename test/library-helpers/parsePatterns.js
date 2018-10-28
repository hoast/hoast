// Dependency modules.
const test = require(`ava`);
// Custom module.
const Hoast = require(`../../library`);
const hoast = Hoast(__dirname);

test(`type`, function(t) {
	t.is(typeof(Hoast.helpers.parsePatterns), `function`);
	t.is(typeof(hoast.helpers.parsePatterns), `function`);
	t.is(Hoast.helpers.parsePatterns, hoast.helpers.parsePatterns);
	
	// Legacy support check.
	t.is(typeof(Hoast.helper.parse), `function`);
	t.is(typeof(hoast.helper.parse), `function`);
	t.is(Hoast.helper.parse, hoast.helper.parse);
	t.is(Hoast.helper.parse, Hoast.helpers.parsePatterns);
});

test(`function`, function(t) {
	// Extra check against `planckmatch/parse` directly.
	t.is(Hoast.helpers.parsePatterns, require(`planckmatch/parse`));
});