// Node modules.
const path = require(`path`);
// Dependency modules.
const test = require(`ava`);
// Helper modules.
const equalDirectory = require(`../../helpers/equalDirectory`);
// Library modules.
const Hoast = require(`../../../library`);
const writeFiles = require(`../../../library/helpers/writeFiles`);

test(`type check`, function(t) {
	const hoast = Hoast(__dirname);
	
	t.is(typeof(Hoast.helpers.writeFiles), `function`);
	t.is(typeof(hoast.helpers.writeFiles), `function`);
	t.is(Hoast.helpers.writeFiles, hoast.helpers.writeFiles);
});

test(`type check legacy`, function(t) {
	const hoast = Hoast(__dirname);
	
	t.is(typeof(Hoast.helper.writeFiles), `function`);
	t.is(typeof(hoast.helper.writeFiles), `function`);
	t.is(Hoast.helper.writeFiles, hoast.helper.writeFiles);
	t.is(Hoast.helper.writeFiles, Hoast.helpers.writeFiles);
});

test(`write files`, async function(t) {
	// Create file path.
	const pathDst = __filename.substring(0, __filename.indexOf(`.`)),
		pathSrc = path.join(__dirname, `source`);
	
	// File data structure.
	const files = [
		{
			content: {
				data: `file content`,
				type: `string`
			},
			path: `file.txt`
		}, {
			content: {
				data: `other content`,
				type: `string`
			},
			path: `other.md`
		}, {
			content: {
				data: `file content`,
				type: `string`
			},
			path: `directory${path.sep}file.txt`
		}
	];
	
	try {
		// Write files.
		await writeFiles(pathDst, files);
		
		// Compare directory.
		await equalDirectory(t, pathDst, pathSrc);
	} catch(error) {
		t.fail(error);
	}
});