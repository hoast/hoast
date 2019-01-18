// Node modules.
const fs = require(`fs`),
	path = require(`path`);
// Custom modules.
const createDirectory = require(`../../library/helpers/createDirectory`);

/**
 * Copies a file located at source to the destination. (Node 7.x compatible)
 * @param {string} source Path to the file that will be copied over.
 * @param {string} destination Path to where the file needs to go.
 * @param {function} callback 
 */
const copyFile = function(source, destination, callback) {
	let callbackCalled = false;
	
	const readStream = fs.createReadStream(source);
	readStream.on(`error`, function(error) {
		done(error);
	});
	const writeStream = fs.createWriteStream(destination);
	writeStream.on(`error`, function(error) {
		done(error);
	});
	writeStream.on(`close`, function() {
		done();
	});
	readStream.pipe(writeStream);
	
	function done(error) {
		if (callbackCalled) {
			return;
		}
		
		callbackCalled = true;
		callback(error);
	}
};

/**
 * Copies a directory or file located at source to the destination.
 * @param {string} source Path to the directory or file that will be copied over.
 * @param {string} destination Path to where the directory or file needs to go.
 */
const copyDirectory = function(source, destination) {
	return new Promise(function(resolve, reject) {
		// Retrieve source status.
		fs.lstat(source, function(error, stats) {
			if (error) {
				return reject(error);
			}
			
			// Check if file.
			if (stats.isFile()) {
				// Create directory.
				createDirectory(path.dirname(destination)).then(function() {
					// Copy file over.
					copyFile(source, destination, function() {
						if (error) {
							return reject(error);
						}
						
						resolve();
					});
				});
				
				return;
			}
			// Else must be a directory.
			
			// Read directories files.
			fs.readdir(source, function(error, files) {
				if (error) {
					return reject(error);
				}
				
				// Recursively call for each file in subdirectory.
				Promise.all(files.map(function(file) {
					// Call this function recursively.
					return copyDirectory(
						path.join(source, file),
						path.join(destination, file)
					);
				})).then(function() {
					resolve();
				}).catch(reject);
			});
		});
	});
};

module.exports = copyDirectory;