// Node modules.
const assert = require(`assert`),
	path = require(`path`);
// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast`); } catch(error) { debug = function() {}; }

/**
 * Validates the options.
 * @param {Object} options The options.
 */
const validateOptions = function(options) {
	assert(
		typeof(options) === `object`,
		`hoast: options must by of type object.`
	);
	if (options.destination) {
		assert(
			typeof(options.destination) === `string`,
			`hoast: options.destination must be of type string.`
		);
	}
	if (options.source) {
		assert(
			typeof(options.source) === `string`,
			`hoast: options.source must be of type string.`
		);
	}
	if (options.remove) {
		assert(
			typeof(options.remove) === `boolean` || Array.isArray(options.remove),
			`hoast: options.remove must be of type boolean or an array of string.`
		);
	}
	if (options.concurrency) {
		assert(
			typeof(options.concurrency) === `number` && !Number.isNaN(options.concurrency),
			`hoast: options.concurrency must be of type number.`
		);
		assert(
			options.concurrency > 0,
			`hoast: concurrency must be greater than zero.`
		);
	}
	if (options.metadata) {
		assert(
			options.metadata !== null && typeof(options.metadata) === `object`,
			`hoast: options.metadata must be of type object.`
		);
	}
};

/**
 * Initializes the object.
 * @param {Object} directory The directory to operate from.
 * @param {Object} options The options.
 */
const Hoast = function(directory, options) {
	// Create instance of this.
	if (!(this instanceof Hoast)) {
		return new Hoast(directory, options);
	}
	debug(`Initializing.`);
	
	// Directory.
	assert(typeof(directory) === `string` && path.isAbsolute(directory), `hoast: directory is a required parameter and must be an absolute path of type string.`);
	this.directory = directory;
	
	if (options) {
		// Validate options.
		validateOptions(options);
		debug(`Validated options.`);
	}
	// Override default options.
	this.options = Object.assign({
		source: `source`,
		destination: `destination`,
		
		concurrency: Infinity,
		
		metadata: {}
	}, options);
	
	debug(`Initialized.`);
};

// Build in read module required to run before process.
Hoast.read = require(`./read`);

// Add custom modules to helper.
Hoast.helper = Hoast.prototype.helper =  {
	// Create a directory at the given path.
	createDirectory: require(`./createDirectory`),
	writeFiles: require(`./writeFiles`),
	remove: require(`./remove`),
	scanDirectory: require(`./scanDirectory`)
};

/**
 * Add a module to the processing stack.
 * @param {Function} module A Hoast compatible module function.
 */
Hoast.prototype.use = function(module) {
	// Reset modules array if not set or of incorrect type.
	if (this.modules == null || !Array.isArray(this.modules)) {
		this.modules = [];
		debug(`Initialized modules array.`);
	}
	// Validate module.
	assert(typeof(module) === `function`, `hoast: module must be of type function.`);
	// Add module to list.
	this.modules.push(module);
	return this;
};

/**
 * Process the files using the specified modules.
 * @param {Object} options 
 */
Hoast.prototype.process = async function(options) {
	// Options.
	if (options) {
		// Override options.
		this.options = Object.assign(this.options, options);
		// Validate options.
		validateOptions(this.options);
		debug(`Validated options.`);
	}
	debug(`Start processing files in '${this.options.source}' directory.`);
	
	if (this.options.remove) {
		if (this.options.remove === true) {
			debug(`Removing '${this.options.destination}' directory.`);
			// If no file paths are defined then remove the entire destination directory.
			await Hoast.helper.remove(this.options.destination);
			debug(`Removed directory.`);
		} else {
			debug(`Removing specified files.`);
			// Remove all files listed in the array.
			for (let i = 0; i < this.options.length; i++) {
				// Prepend the destination directory to each file path.
				await Hoast.helper.remove(path.join(this.options.destination, this.options[i]));
			}
			debug(`Removed files.`);
		}
	}
	
	// Call before function on modules.
	debug(`Start calling before function on modules.`);
	for (let i = 0; i < this.modules.length; i++) {
		if (this.modules[i].hasOwnProperty(`before`) && typeof(this.modules[i].before) === `function`) {
			await this.modules[i].before(this);
		}
	}
	debug(`Finished calling before function on modules.`);
	
	// Scan source for files.
	debug(`Scanning files.`);
	let files = await Hoast.helper.scanDirectory(path.join(this.directory, this.options.source));
	debug(`Scanned files, found ${files.length} files.`);
	
	// Batch out files as to not handle to many at once.
	let batch;
	while (files.length > 0) {
		// Slice files based on concurrent option into batches.
		batch = files.splice(0, this.options.concurrency);
		debug(`Created batch of ${batch.length} files.`);
		
		// Process each module over the batched files.
		for (let i = 0; i < this.modules.length; i++) {
			// Override batch if new files are returned.
			batch = await this.modules[i](this, batch) || batch;
			// Check if any files are left in the batch.
			if (batch.length <= 0) {
				break;
			}
		}
		debug(`Batched processed.`);
		
		// Check if any files left to write to storage.
		if (batch.length <= 0) {
			debug(`No files left in batch to write to storage.`);
			continue;
		}
		// Write batched files to disk.
		debug(`Writing batch to storage.`);
		await Hoast.helper.writeFiles(this.options.destination, batch);
		debug(`Batch written.`);
	}
	debug(`Finished processing files to '${this.options.destination}' directory.`);
	
	// Call after function on modules.
	debug(`Start calling after function on modules.`);
	for (let i = 0; i < this.modules.length; i++) {
		if (this.modules[i].hasOwnProperty(`after`) && typeof(this.modules[i].after) === `function`) {
			await this.modules[i].after(this);
		}
	}
	debug(`Finished calling after function on modules.`);
	
	// Return hoast.
	return this;
};

module.exports = Hoast;