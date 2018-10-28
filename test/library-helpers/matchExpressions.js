// Dependency modules.
const test = require(`ava`);
// Custom module.
const Hoast = require(`../../library`);
const hoast = Hoast(__dirname);

test(`type`, function(t) {
	t.is(typeof(Hoast.helpers.matchExpressions), `function`);
	t.is(typeof(hoast.helpers.matchExpressions), `function`);
	t.is(Hoast.helpers.matchExpressions, hoast.helpers.matchExpressions);
	
	// Legacy support check.
	t.is(typeof(Hoast.helper.match), `function`);
	t.is(typeof(hoast.helper.match), `function`);
	t.is(Hoast.helper.match, hoast.helper.match);
	t.is(Hoast.helper.match, Hoast.helpers.matchExpressions);
});

test(`function`, function(t) {
	// Setup variables.
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
	
	// Check single pattern.
	t.true(Hoast.helpers.matchExpressions(value, expressionsValid[0]));
	t.false(Hoast.helpers.matchExpressions(value, expressionsInvalid[0]));
	
	// Check default `all` value.
	t.true(Hoast.helpers.matchExpressions(value, [ expressionsInvalid[0], expressionsValid[0] ]));
	
	// Check `all = true` workings.
	t.true(Hoast.helpers.matchExpressions(value, expressionsValid, true));
	t.false(Hoast.helpers.matchExpressions(value, expressionsInvalid, true));
	t.false(Hoast.helpers.matchExpressions(value, [ expressionsValid[0], expressionsInvalid[0] ], true));
	
	// Check `all = false` workings, in other words `any` mode.
	t.true(Hoast.helpers.matchExpressions(value, expressionsValid, false));
	t.false(Hoast.helpers.matchExpressions(value, expressionsInvalid, false));
	t.true(Hoast.helpers.matchExpressions(value, [ expressionsInvalid[0], expressionsValid[0] ], false));
});