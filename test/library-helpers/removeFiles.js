// Dependency modules.
const test = require(`ava`);
// Custom module.
const Hoast = require(`../../library`);
const hoast = Hoast(__dirname);

test(`type`, function(t) {
	t.is(typeof(Hoast.helpers.removeFiles), `function`);
	t.is(typeof(hoast.helpers.removeFiles), `function`);
	t.is(Hoast.helpers.removeFiles, hoast.helpers.removeFiles);
	
	// Legacy support check.
	t.is(typeof(Hoast.helper.remove), `function`);
	t.is(typeof(hoast.helper.remove), `function`);
	t.is(Hoast.helper.remove, hoast.helper.remove);
	t.is(Hoast.helper.remove, Hoast.helpers.removeFiles);
});