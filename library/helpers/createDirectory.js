// Node modules.
const fs = require(`fs`),
	path = require(`path`);

/**
 * Create a directory.
 * @param {String} directory Path of the directory.
 */
const createDirectory = function(directory) {
	// Join and split path into sequential directory segments.
	directory = directory.split(path.sep);
	
	// If path started with separator prepend this to the first segment.
	if (directory[0] === ``) {
		directory.shift();
		directory[0] = `${path.sep}${directory[0]}`;
	}
	
	// Iterate over each part of the directory path and add the next part to each subsequent promise.
	return directory.reduce(function(promise, directory) {
		return promise.then(function(previous) {
			if (previous) {
				directory = `${previous}${path.sep}${directory}`;
			}
			
			// Check if directory already exists.
			if (fs.existsSync(directory)) {
				// Directory already exists go to next element of path.
				return new Promise(function(resolve, reject) {
					fs.lstat(directory, function(error, stats) {
						if (error) {
							return reject(error);
						}
						resolve(stats);
					});
				}).then(function(stats) {
					if (stats.isDirectory()) {
						return directory;
					}
				});
			}
			
			// Create the directory.
			return new Promise(function(resolve, reject) {
				fs.mkdir(directory, function(error) {
					if (error && error.code !== `EEXIST`) {
						return reject(error);
					}
					resolve(directory);
				});
			});
		});
	}, Promise.resolve(null));
};

module.exports = createDirectory;