// Node modules.
const fs = require(`fs`),
	path = require(`path`);
// Dependency modules.
const test = require(`ava`);
// Custom module.
const Hoast = require(`../library`);

// Constants.
const DESTINATION = `dst`,
	SOURCE = `src`;

// Hoast instance.
let hoast;

test.serial(`initializing hoast`, function(t) {
	const options = {
		source: `hoast_src`,
		destination: `hoast_dst`,
		
		remove: true,
		patterns: [
			`file.*`
		],
		patternOptions: {},
		concurrency: 16,
		
		metadata: {
			title: `instance`
		}
	};
	
	hoast = Hoast(__dirname, options);
	
	t.deepEqual(hoast.directory, __dirname);
	t.deepEqual(hoast.options, options);
});

test.serial(`adding modules`, function(t) {
	t.is(hoast.modules, undefined);
	
	hoast.use(Hoast.read());
	
	t.is(hoast.modules.length, 1);
	t.deepEqual(hoast.modules[0], Hoast.read());
});

test.serial(`processing files`, async function(t) {
	t.plan(13); // `method` gets called twice.
	
	const options = {
		source: SOURCE,
		destination: DESTINATION,
		
		remove: [
			DESTINATION,
			`${DESTINATION}-TEST`
		],
		patterns: [
			`directory`,
			`directory${path.sep}*`
		],
		patternOptions: {},
		concurrency: 1,
		
		metadata: {
			title: `process`
		}
	};
	
	// Create mock-up module.
	const method = function(_hoast, files) {
		// Check hoast.
		t.deepEqual(hoast, _hoast);
		
		// Check if file is read and other file is filtered out.
		t.is(files.length, 1);
		
		const file = files[0];
		// Check if scan directories worked.
		t.true(file.hasOwnProperty(`path`));
		t.true(file.hasOwnProperty(`stats`));
		
		// Check if read module worked.
		t.true(file.hasOwnProperty(`content`));
		
		if (file.path === `directory${path.sep}file.txt`) {
			return [];
		}
	};
	method.before = function(_hoast) {
		// Check hoast.
		t.deepEqual(hoast, _hoast);
	};
	method.after = function(_hoast) {
		// Check hoast.
		t.deepEqual(hoast, _hoast);
	};
	// Add mock-up module.
	hoast.use(method);
	
	try {
		await hoast.process(options);
	} catch(error) {
		throw error;
	}
	
	t.deepEqual(hoast.options, options);
});

test.serial.after(`clean-up`, async function(t) {
	// Construct path of destination directory.
	const directory = path.join(__dirname, DESTINATION);
	
	// Check if directory exists before.
	t.true(fs.existsSync(directory));
	
	await Hoast.helpers.removeFiles.single(directory);
	
	// Check if directory exists after.
	t.false(fs.existsSync(directory));
});