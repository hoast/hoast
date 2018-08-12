// Node modules.
const { existsSync, readFileSync } = require(`fs`),
	{ join } = require(`path`);
// Dependecy modules.
const test = require(`ava`);
// Custom module.
const remove = require(`./libraries/remove`),
	write = require(`./libraries/write`).files;
const Hoast = require(`.`);

// Reference data.
const REF = {
	directory: `TEST_directory`,
	file: {
		path: `file.txt`,
		content: {
			type: `string`,
			data: `content`
		}
	}
};

test.serial(`libraries-write`, async function(t) {
	// Write data to storage.
	await write(REF.directory, [ REF.file ]);
	
	// Read content from written file.
	const content = readFileSync(join(REF.directory, REF.file.path), `utf8`);
	
	// Check content.
	t.is(content, REF.file.content.data);
});

test.serial(`hoast`, async function(t) {
	t.plan(18);
	
	// Setup hoast with all options overriden.
	let options = {
		source: `src`,
		destination: `dst`,
		
		remove: false,
		concurrency: 8,
		
		metadata: {
			title: `hoast`
		}
	};
	const hoast = Hoast(__dirname, options);
	// Check options.
	t.is(hoast.directory, __dirname);
	t.deepEqual(hoast.options, options);
	
	// Add read module.
	hoast.use(Hoast.read());
	// Check modules.
	t.is(hoast.modules.length, 1);
	t.is(typeof(hoast.modules[0]), `function`);
	
	// Setup new completly different options.
	options = {
		source: REF.directory,
		destination: join(REF.directory, `dst`),
		
		remove: true,
		concurrency: 1,
		
		metadata: {
			title: `test`
		}
	};
	
	// Create mock-up module.
	const method = function(hoast, files) {
		// Check hoast.
		t.is(typeof(hoast), `object`);
		t.deepEqual(hoast.options, options);
		t.true(hoast.hasOwnProperty(`modules`));
		
		// Check hoast helper functions.
		t.is(typeof(hoast.helper), `object`);
		t.is(typeof(hoast.helper.createDirectory), `function`);
		
		// Check files.
		t.is(files.length, 1);
		const file = files[0];
		t.true(file.hasOwnProperty(`stats`));
		// Remove stats bacause it is prone to vary.
		delete file.stats;
		t.deepEqual(file, REF.file);
	};
	method.before = function(hoast) {
		// Check hoast.
		t.is(typeof(hoast), `object`);
		t.deepEqual(hoast.options, options);
		t.true(hoast.hasOwnProperty(`modules`));
	};
	method.after = function(hoast) {
		// Check hoast.
		t.is(typeof(hoast), `object`);
		t.deepEqual(hoast.options, options);
		t.true(hoast.hasOwnProperty(`modules`));
	};
	// Add mock-up module.
	hoast.use(method);
	
	// Return process so module test can be run.
	return hoast.process(options);
});

test.serial(`libraries-remove`, async function(t) {
	// Check if directory exists before.
	t.true(existsSync(REF.directory));
	
	// Clean-up written data.
	await remove(REF.directory);
	
	// Check if directory exists after.
	t.false(existsSync(REF.directory));
});