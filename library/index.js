// Node modules.
const path = require(`path`);
// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast`); } catch(error) { debug = function() {}; }

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
	this.directory = directory;
	
	// Set default options.
	this.options = {
		source: `source`,
		destination: `destination`,
		
		remove: false,
		patterns: [],
		patternOptions: {},
		concurrency: Infinity,
		
		metadata: {}
	};
	if (options) {
		// Override default options.
		this.options = Object.assign(this.options, options);
		
		// Parse new patterns to expressions.
		if (options.patterns) {
			this.expressions = this.helper.parse(this.options.patterns, this.options.patternOptions);
			debug(`Patterns parsed to '${this.expressions}'.`);
		}
	}
	
	debug(`Initialized.`);
};

// Build in read module required to run before process.
Hoast.read = require(`./read`);

// Add custom modules to helper.
Hoast.helper = Hoast.prototype.helper = {
	// Create a directory at the given path.
	parse: require(`planckmatch/parse`),
	match: require(`./match`),
	
	scanDirectory: require(`./scanDirectory`),
	
	createDirectory: require(`./createDirectory`),
	writeFiles: require(`./writeFiles`),
	
	remove: require(`./remove`)
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
	// Add module to list.
	this.modules.push(module);
	return this;
};

/**
 * Process the files using the specified modules.
 * @param {Object} options 
 */
Hoast.prototype.process = async function(options) {
	if (options) {
		// Override options.
		this.options = Object.assign(this.options, options);
		
		// Parse new patterns to expressions.
		if (options.patterns) {
			this.expressions = this.helper.parse(this.options.patterns, this.options.patternOptions);
			debug(`Patterns parsed to '${this.expressions}'.`);
		}
	}
	debug(`Start processing files in '${this.options.source}' directory.`);
	
	// Remove the destination directory or specified files within it.
	if (this.options.remove) {
		switch(typeof(this.options.remove)) {
			case `boolean`:
				debug(`Removing '${this.options.destination}' directory.`);
				
				// If no file paths are defined then remove the entire destination directory.
				await this.helper.remove(this.options.destination);
				
				break;
			case `string`:
				debug(`Removing '${this.options.remove}' directory/file in '${this.options.destination}' directory.`);
				
				// Remove given directory or file.
				await this.helper.remove(path.join(this.options.destination, this.options.remove));
				
				break;
			default:
				if (Array.isArray(this.options.remove)) {
					debug(`Removing listed directories and/or files in '${this.options.destination}' directory.`);
					
					// Remove all directories or files listed in the array.
					const length = this.options.remove.length;
					for (let i = 0; i < length; i++) {
						await this.helper.remove(path.join(this.options.destination, this.options.remove[i]));
					}
				}
				
				break;
		}
		debug(`Finished removing.`);
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
	let files = await this.helper.scanDirectory(this.expressions, this.options.patternOptions.all, path.join(this.directory, this.options.source));
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
		await this.helper.writeFiles(this.options.destination, batch);
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