// Dependency modules.
const test = require(`ava`);
// Library modules.
const Hoast = require(`../../../library`);
const createDirectory = require(`../../../library/helpers/createDirectory`),
	removeFiles = require(`../../../library/helpers/removeFiles`);
// Helper modules.
const constructTree = require(`../../helpers/constructTree`);

test(`type check`, function(t) {
	const hoast = Hoast(__dirname);
	
	t.is(typeof(Hoast.helpers.createDirectory), `function`);
	t.is(typeof(hoast.helpers.createDirectory), `function`);
	t.is(Hoast.helpers.createDirectory, hoast.helpers.createDirectory);
});

test(`type check legacy`, function(t) {
	const hoast = Hoast(__dirname);
	
	t.is(typeof(Hoast.helper.createDirectory), `function`);
	t.is(typeof(hoast.helper.createDirectory), `function`);
	t.is(Hoast.helper.createDirectory, hoast.helper.createDirectory);
	t.is(Hoast.helper.createDirectory, Hoast.helpers.createDirectory);
});

/**
 * Clean-up: always remove build directories.
*/
test.afterEach.always(`Remove files`, function(t) {
	t.plan(1);
	
	// Remove directory.
	return removeFiles(__filename.substring(0, __filename.indexOf(`.`)))
		.then(function() {
			t.pass();
		})
		.catch(function(error) {
			t.fail(error);
		});
});

test.serial(`create directory`, async function(t) {
	// Get path of this file, remove extension.
	const filePath = __filename.substring(0, __filename.indexOf(`.`));
	
	// Call create directory.
	try {
		await createDirectory(filePath);
	} catch(error) {
		t.fail(error);
	}
	
	// Check directory exists.
	try {
		t.deepEqual(await constructTree(filePath), { files: [], path: `` });
	} catch(error) {
		t.fail(error);
	}
});