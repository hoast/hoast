// Node modules.
const path = require(`path`);
// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast`); } catch(error) { debug = function() {}; }

/**
 * Initializes the object.
 * @param {object} directory The directory to operate from.
 * @param {object} options The options.
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
			this.expressions = this.helper.parse(this.options.patterns, this.options.patternOptions, true);
			debug(`Patterns parsed to '${this.expressions}'.`);
		}
	}
	
	debug(`Initialized.`);
};

// Build in read module required to run before process.
Hoast.read = require(`./read`);

// Add helpers.
Hoast.helpers = Hoast.prototype.helpers = {
	createDirectory: require(`./helpers/createDirectory`),
	deepAssign: require(`./helpers/deepAssign`),
	matchExpressions: require(`./helpers/matchExpressions`),
	parsePatterns: require(`planckmatch/parse`),
	removeFiles: require(`./helpers/removeFiles`),
	scanDirectory: require(`./helpers/scanDirectory`),
	writeFiles: require(`./helpers/writeFiles`)
};
// Legacy helpers.
Hoast.helper = Hoast.prototype.helper = {
	createDirectory: require(`./helpers/createDirectory`),
	match: require(`./helpers/matchExpressions`),
	parse: require(`planckmatch/parse`),
	remove: require(`./helpers/removeFiles`),
	scanDirectory: require(`./helpers/scanDirectory`),
	writeFiles: require(`./helpers/writeFiles`)
};

/**
 * Add a module to the processing stack.
 * @param {function} module A Hoast compatible module function.
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
 * @param {object} options 
 */
Hoast.prototype.process = async function(options) {
	if (options) {
		// Override options.
		this.options = Object.assign(this.options, options);
		
		// Parse new patterns to expressions.
		if (options.patterns) {
			this.expressions = this.helpers.parsePatterns(this.options.patterns, this.options.patternOptions);
			debug(`Patterns parsed to '${this.expressions}'.`);
		}
	}
	debug(`Start processing files in '${this.options.source}' directory.`);
	
	// Absolute directory to remove and write from.
	const directoryDestination = path.join(this.directory, this.options.destination),
		directorySource = path.join(this.directory, this.options.source);
	
	// Remove the destination directory or specified files within it.
	if (this.options.remove) {
		debug(`Start removing.`);
		
		// Remove type.
		const type = typeof(this.options.remove);
		if (type === `boolean`) {
			debug(`Removing '${directoryDestination}' directory.`);
			
			// If no file paths are defined then remove the entire destination directory.
			await this.helpers.removeFiles.single(directoryDestination);
		} else if (type === `string`) {
			debug(`Removing '${this.options.remove}' directory/file in '${directoryDestination}' directory.`);
			
			// Remove given directory or file.
			await this.helpers.removeFiles.single(path.join(directoryDestination, this.options.remove));
		} else if (Array.isArray(this.options.remove)) {
			debug(`Removing listed directories and/or files in '${directoryDestination}' directory.`);
			
			// Remove all directories or files listed in the array.
			await this.helpers.removeFiles(
				this.options.remove.map(function(file) {
					return path.join(directoryDestination, file);
				})
			);
		} else {
			debug(`Nothing removed as 'remove' option not of valid type.`);
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
	let files = await this.helpers.scanDirectory(directorySource, this.expressions, this.options.patternOptions.all);
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
		await this.helpers.writeFiles(directoryDestination, batch);
		debug(`Batch written.`);
	}
	debug(`Finished processing files to '${directoryDestination}' directory.`);
	
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