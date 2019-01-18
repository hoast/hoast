// Dependency modules.
const test = require(`ava`);
// Library modules.
const Hoast = require(`../../../library`);

// Constant test data.
const value = `directory/file.extension`;
const expressionsValid = Hoast.helpers.parsePatterns([
	`directory/*`,
	`*/file.*`,
	`*.extension`
], {}, false);
const expressionsInvalid = Hoast.helpers.parsePatterns([
	`dirname/*`,
	`*/filename.*`,
	`*.extname`
], {}, false);

test(`type check`, function(t) {
	const hoast = Hoast(__dirname);
	
	t.is(typeof(Hoast.helpers.matchExpressions), `function`);
	t.is(typeof(hoast.helpers.matchExpressions), `function`);
	t.is(Hoast.helpers.matchExpressions, hoast.helpers.matchExpressions);
});

test(`type check legacy`, function(t) {
	const hoast = Hoast(__dirname);
	
	t.is(typeof(Hoast.helper.match), `function`);
	t.is(typeof(hoast.helper.match), `function`);
	t.is(Hoast.helper.match, hoast.helper.match);
	t.is(Hoast.helper.match, Hoast.helpers.matchExpressions);
});

test(`expressions undefined`, function(t) {
	t.true(Hoast.helpers.matchExpressions(value, undefined));
	t.true(Hoast.helpers.matchExpressions(value, null));
	t.true(Hoast.helpers.matchExpressions(value, []));
});

test(`single pattern`, function(t) {
	t.true(Hoast.helpers.matchExpressions(value, expressionsValid[0]));
	t.false(Hoast.helpers.matchExpressions(value, expressionsInvalid[0]));
});

test(`default all value`, function(t) {
	t.true(Hoast.helpers.matchExpressions(value, [ expressionsInvalid[0], expressionsValid[0] ]));
});

test(`all value is true`, function(t) {
	t.true(Hoast.helpers.matchExpressions(value, expressionsValid, true));
	t.false(Hoast.helpers.matchExpressions(value, expressionsInvalid, true));
	t.false(Hoast.helpers.matchExpressions(value, [ expressionsValid[0], expressionsInvalid[0] ], true));
});

test(`all value is false`, function(t) {
	// In other words `any` mode.
	t.true(Hoast.helpers.matchExpressions(value, expressionsValid, false));
	t.false(Hoast.helpers.matchExpressions(value, expressionsInvalid, false));
	t.true(Hoast.helpers.matchExpressions(value, [ expressionsInvalid[0], expressionsValid[0] ], false));
});