// Dependency modules.
const test = require(`ava`);
// Helper modules.
const constructTree = require(`../../helpers/constructTree`);
// Library modules.
const Hoast = require(`../../../library`);
const createDirectory = require(`../../../library/helpers/createDirectory`),
	removeFiles = require(`../../../library/helpers/removeFiles`);

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

test.serial(`create directory`, async function(t) {
	// Get path of this file, remove extension.
	const filePath = __filename.substring(0, __filename.indexOf(`.`));
	
	try {
		// Create directory.
		await createDirectory(filePath);
		
		// Check directory.
		t.deepEqual(await constructTree(filePath), { files: [], path: `` });
		
		// Remove directory.
		await removeFiles(filePath);
	} catch(error) {
		t.fail(error);
	}
});