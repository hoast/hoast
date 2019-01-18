// Node modules.
const path = require(`path`);
// Dependency modules.
const test = require(`ava`);
// Library modules.
const Hoast = require(`../../../library`);
const parsePatterns = require(`../../../node_modules/planckmatch/parse`),
	scanDirectory = require(`../../../library/helpers/scanDirectory`);

test(`type check`, function(t) {
	const hoast = Hoast(__dirname);
	
	t.is(typeof(Hoast.helpers.scanDirectory), `function`);
	t.is(typeof(hoast.helpers.scanDirectory), `function`);
	t.is(Hoast.helpers.scanDirectory, hoast.helpers.scanDirectory);
});

test(`type check legacy`, function(t) {
	const hoast = Hoast(__dirname);
	
	t.is(typeof(Hoast.helper.scanDirectory), `function`);
	t.is(typeof(hoast.helper.scanDirectory), `function`);
	t.is(Hoast.helper.scanDirectory, hoast.helper.scanDirectory);
	t.is(Hoast.helper.scanDirectory, Hoast.helpers.scanDirectory);
});

test(`scan directory`, async function(t) {
	// Create file path.
	const pathSrc = path.join(__dirname, `source`),
		patterns = parsePatterns([ `directory`, `*/*.txt` ], { globstar: true }, true);
	
	try {
		// Scan directory.
		let files = await scanDirectory(
			pathSrc,
			// Parse patterns.
			patterns,
			// Any pattern needs to match.
			false
		);
		
		files = files.map(function(file) {
			// Check file data.
			t.true(file.hasOwnProperty(`path`));
			t.true(file.hasOwnProperty(`stats`));
			t.true(file.stats.hasOwnProperty(`dev`));
			t.true(file.stats.hasOwnProperty(`ino`));
			t.true(file.stats.hasOwnProperty(`mode`));
			t.true(file.stats.hasOwnProperty(`nlink`));
			t.true(file.stats.hasOwnProperty(`uid`));
			t.true(file.stats.hasOwnProperty(`gid`));
			t.true(file.stats.hasOwnProperty(`rdev`));
			t.true(file.stats.hasOwnProperty(`size`));
			t.true(file.stats.hasOwnProperty(`atimeMs`));
			t.true(file.stats.hasOwnProperty(`mtimeMs`));
			t.true(file.stats.hasOwnProperty(`ctimeMs`));
			t.true(file.stats.hasOwnProperty(`birthtimeMs`));
			
			// Remove properties only leave path.
			return file.path;
		});
		
		// Compare found files.
		t.deepEqual(files, [
			`directory${path.sep}file.txt`
		]);
	} catch(error) {
		t.fail(error);
	}
});