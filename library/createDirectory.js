// Node modules.
const fs = require(`fs`),
	path = require(`path`);

/**
 * Create a directory at the path.
 * @param {String} directory Path of the directory.
 */
module.exports = function(directory) {
	// Split directory path into sequential directory name segments.
	directory = directory.split(path.sep);
	// Iterate over each part of the directory path and add the next part to each subsequent promise.
	return directory.reduce(function(promise, directory) {
		return promise.then(function(previous) {
			directory = path.join(previous, directory);
			// Check if directory already exists.
			return new Promise(function(resolve) {
				fs.exists(directory, function(exists) {
					resolve(exists);
				});
			}).then(function(exists) {
				if (exists) {
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
		});
	}, Promise.resolve(``));
};