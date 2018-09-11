// Node modules.
const { existsSync, readFileSync } = require(`fs`),
	{ join } = require(`path`);
// Dependency modules.
const test = require(`ava`);
// Custom module.
const Hoast = require(`.`);

// Reference data.
const REF = {
	directory: `TEST-DIR`,
	file: {
		path: `file.txt`,
		content: {
			type: `string`,
			data: `content`
		}
	}
};

test(`properties`, function(t) {
	// Modules.
	t.is(typeof(Hoast), `function`);
	t.is(typeof(Hoast.read), `function`);
	
	// Helper functions.
	t.is(typeof(Hoast.helper), `object`);
	t.is(typeof(Hoast.helper.createDirectory), `function`);
	t.is(typeof(Hoast.helper.writeFiles), `function`);
	t.is(typeof(Hoast.helper.remove), `function`);
	t.is(typeof(Hoast.helper.scanDirectory), `function`);
});

test.serial(`write`, async function(t) {
	// Write data to storage.
	await Hoast.helper.writeFiles(REF.directory, [ REF.file ]);
	
	// Read content from written file.
	const content = readFileSync(join(REF.directory, REF.file.path), `utf8`);
	
	// Check content.
	t.is(content, REF.file.content.data);
});

test.serial(`use-case`, async function(t) {
	t.plan(16);
	
	// Setup hoast with all options overridden.
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
	
	// Setup new completely different options.
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
		
		// Check files.
		t.is(files.length, 1);
		const file = files[0];
		t.true(file.hasOwnProperty(`stats`));
		// Remove stats because it is prone to vary.
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
	await hoast.process(options);
});

test.serial(`remove`, async function(t) {
	// Check if directory exists before.
	t.true(existsSync(REF.directory));
	
	// Clean-up written data.
	await Hoast.helper.remove(REF.directory);
	
	// Check if directory exists after.
	t.false(existsSync(REF.directory));
});