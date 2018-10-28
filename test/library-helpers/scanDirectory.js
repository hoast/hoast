// Dependency modules.
const test = require(`ava`);
// Custom module.
const Hoast = require(`../../library`);
const hoast = Hoast(__dirname);

test(`type`, function(t) {
	t.is(typeof(Hoast.helpers.scanDirectory), `function`);
	t.is(typeof(hoast.helpers.scanDirectory), `function`);
	t.is(Hoast.helpers.scanDirectory, hoast.helpers.scanDirectory);
	
	// Legacy support check.
	t.is(typeof(Hoast.helper.scanDirectory), `function`);
	t.is(typeof(hoast.helper.scanDirectory), `function`);
	t.is(Hoast.helper.scanDirectory, hoast.helper.scanDirectory);
	t.is(Hoast.helper.scanDirectory, Hoast.helpers.scanDirectory);
});