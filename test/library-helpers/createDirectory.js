// Dependency modules.
const test = require(`ava`);
// Custom module.
const Hoast = require(`../../library`);
const hoast = Hoast(__dirname);

test(`type`, function(t) {
	t.is(typeof(Hoast.helpers.createDirectory), `function`);
	t.is(typeof(hoast.helpers.createDirectory), `function`);
	t.is(Hoast.helpers.createDirectory, hoast.helpers.createDirectory);
	
	// Legacy support check.
	t.is(typeof(Hoast.helper.createDirectory), `function`);
	t.is(typeof(hoast.helper.createDirectory), `function`);
	t.is(Hoast.helper.createDirectory, hoast.helper.createDirectory);
	t.is(Hoast.helper.createDirectory, Hoast.helpers.createDirectory);
});