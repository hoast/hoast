// Node modules.
const fs = require(`fs`),
	path = require(`path`);
// Get whether OS is windows.
const isWin = process.platform === `win32`;

/**
 * Create a directory.
 * @param {String} directory Path of the directory.
 */
const createDirectory = function(directory) {
	// Join and split path into sequential directory names.
	directory = directory.split(path.sep);
	// Iterate over each part of the directory path and add the next part to each subsequent promise.
	return directory.reduce(function(promise, directory) {
		return promise.then(function(previous) {
			if (previous) {
				if (isWin) {
					directory = `${previous}${path.sep}${directory}`;
				} else {
					directory = path.join(previous, directory);
				}
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