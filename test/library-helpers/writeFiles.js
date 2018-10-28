// Dependency modules.
const test = require(`ava`);
// Custom module.
const Hoast = require(`../../library`);
const hoast = Hoast(__dirname);

test(`type`, function(t) {
	t.is(typeof(Hoast.helpers.writeFiles), `function`);
	t.is(typeof(hoast.helpers.writeFiles), `function`);
	t.is(Hoast.helpers.writeFiles, hoast.helpers.writeFiles);
	
	// Legacy support check.
	t.is(typeof(Hoast.helper.writeFiles), `function`);
	t.is(typeof(hoast.helper.writeFiles), `function`);
	t.is(Hoast.helper.writeFiles, hoast.helper.writeFiles);
	t.is(Hoast.helper.writeFiles, Hoast.helpers.writeFiles);
});