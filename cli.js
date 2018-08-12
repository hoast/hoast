#!/usr/bin/env node

// Node modules.
const { constants, access, readFile } = require(`fs`),
	pathResolve = require(`path`).resolve;
// If debug available require it.
let debug; try { debug = require(`debug`)(`hoast-cli`); } catch(error) { debug = function() {}; }
// Dependecy modules.
const commander = require(`commander`);
// Custom modules.
const info = require(`./package.json`),
	Hoast = require(`.`);

// Setup command utility.
commander
	.name(info.name)
	.description(info.description)
	.version(info.version)
	.option(`-c, --config <path>`, `path to configuration file`, info.name.concat(`.json`))
	.parse(process.argv);

// Translate arguments.
const directory = process.cwd();
const filePath = pathResolve(directory, commander.config);
debug(`Process from ${filePath} configuration.`);
// Check file access.
access(filePath, constants.F_OK | constants.R_OK, function(error) {
	if (error) {
		throw error;
	}
	debug(`Configuration accessible.`);
	
	// Read file.
	readFile(filePath, async function(error, data) {
		if (error) {
			throw error;
		}
		debug(`Configuration read: ${data}`);
		
		// Parse file content to JSON.
		const config = JSON.parse(data);
		
		// Initilize hoast.
		const hoast = Hoast(directory, config.options);
		
		debug(`Start adding modules.`);
		// Modules cache.
		const moduleCache = {
			// Already add in any build-in modules.
			read: Hoast.read
		};
		// Add all modules.
		if (Array.isArray(config.modules)) {
			for (let i = 0; i < config.modules.length; i++) {
				await addModule(directory, hoast, moduleCache, config.modules[i]);
			}
		} else if (typeof(config.modules) === `object`) {
			await addModule(directory, hoast, moduleCache, config.modules);
		} else {
			throw {
				message: `Modules configuration must be of type object or array.`
			};
		}
		debug(`Finished adding modules.`);
		
		// Process.
		hoast.process()
			.then(function() {
				debug(`Processing successfully finished!`);
			})
			.catch(function(error) {
				throw error;
			});
	});
});

const addModule = async function(directory, hoast, moduleCache, moduleConfig) {
	for (const name in moduleConfig) {
		if (!moduleConfig.hasOwnProperty(name)) {
			continue;
		}
		
		// If module not already loaded.
		if (!moduleCache[name]) {
			// Get module path.
			const modulePath = await getModulePath(directory, name);
			if (!modulePath) {
				throw {
					message: `Unable to find path to module: '${name}'.`
				};
			}
			// Require module.
			moduleCache[name] = require(modulePath);
		}
		// Add module to stack.
		hoast.use(moduleCache[name](moduleConfig[name]));
		debug(`Added '${name}' module.`);
	}
};

/**
 * Tries to retrieve the path to the module of that name.
 * @param {String} directory The working directory.
 * @param {String} moduleName Name of the module.
 */
const getModulePath = async function(directory, moduleName) {
	// Create all possible paths.
	let modulePaths = [
		pathResolve(directory, `node_modules`, moduleName),
		pathResolve(directory, moduleName),
		pathResolve(directory, moduleName).concat(`.js`),
		moduleName,
		moduleName.concat(`.js`)
	];
	
	// Check the access to each path to find the right one.
	while(modulePaths.length > 0) {
		const modulePath = modulePaths.pop();
		const result = await checkPathAccess(modulePath);
		// If result is positive return that path.
		if (result) {
			return modulePath;
		}
	}
	
	// If still not found then exit with an error.
	return {
		message: `Unable to find the '${moduleName}' module.`
	};
};

const checkPathAccess = function(filePath) {
	return new Promise(function(resolve) {
		access(filePath, constants.F_OK | constants.R_OK, function(error) {
			if (error) {
				// If not found return false.
				return resolve(false);
			}
			// If found return path.
			resolve(true);
		});
	});
};