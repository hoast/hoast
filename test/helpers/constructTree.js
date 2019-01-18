// Node modules.
const fs = require(`fs`),
	path = require(`path`);

/**
 * Creates a file tree by scanning the given directory recursively.
 * @param {string} directory Absolute path to directory.
 * @param {string} fileName Name of
 */
const constructTree = async function(directory, file = ``) {
	// Create absolute path.
	if (file !== ``) {
		directory = path.join(directory, file);
	}
	
	return new Promise(function(resolve, reject) {
		// Retrieve file status.
		fs.lstat(directory, function(error, stats) {
			if (error) {
				return reject(error);
			}
			
			// Check if file.
			if (stats.isFile()) {
				return resolve(file);
			}
			// Else must be a directory.
			
			// Read directory and invoke this method for all items in it.
			fs.readdir(directory, function(error, content) {
				if (error) {
					return reject(error);
				}
				
				// Recursively call for each file in subdirectory.
				Promise.all(content.map(function(item) {
					// Recursively call this again.
					return constructTree(directory, item);
				})).then(function(results) {
					return resolve({
						path: file,
						files: results
					});
				}).catch(reject);
			});
		});
	});
};

module.exports = constructTree;