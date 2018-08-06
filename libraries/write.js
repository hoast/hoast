// Node modules.
const { exists, lstat, mkdir, writeFile } = require('fs'),
	  { join, sep, dirname } = require('path');

const write = {};

/**
 * Create a directory at the path.
 * @param {String} directory Path of the directory.
 * @param {Number} mode Access mode, default is 0777.
 */
write.directory = function(directory, mode) {
	// Split directory path into sequential directory name segments.
	directory = directory.split(sep);
	// Iterate over each part of the directory path and add the next part to each subsequent promise.
	return directory.reduce(function(promise, directory) {
		return promise.then(function(previous) {
			directory = join(previous, directory);
			// Check if directory already exists.
			return new Promise(function(resolve) {
				exists(directory, function(exists) {
					resolve(exists);
				});
			}).then(function(exists) {
				if (exists) {
					// Directory already exists go to next element of path.
					return new Promise(function(resolve, reject) {
						lstat(directory, function(error, stats) {
							if (error) {
								return reject(error);
							}
							resolve(stats);
						});
					}).then(function(stats) {
						if (stats.isDirectory()) {
							return directory;
						}
						return reject('Cannot create directory at since path references a pre-existing file: ' + directory);
					});
				}
				// Create the directory.
				return new Promise(function(resolve, reject) {
					mkdir(directory, mode || 0777, function(error) {
						if (error && error.code !== 'EEXIST') {
							return reject(error);
						}
						resolve(directory);
					});
				});
			});
		});
	}, Promise.resolve(''));
};

/**
 * Write the file to the directory.
 * @param {String} directory Directory path.
 * @param {Object} file File data.
 */
write.file = function(directory, file) {
	return new Promise(function(resolve, reject) {
		write.directory(join(directory, dirname(file.path)))
			.then(function() {
				if (!file.content) {
					throw 'hoast.write: No content found on file, read module needs to be called before process.';
				}	
				writeFile(
					join(directory, file.path),
					file.content.type === 'string' ? file.content.data : file.content,
					function(error) {
						if (error) {
							return reject(error);
						}
						resolve();
					}
				);
			}).catch(reject);
	});
};

/**
 * Writes each file to the directory.
 * @param {String} directory Directory path.
 * @param {Object} files File dataset.
 */
write.files = function(directory, files) {
	return new Promise(function(resolve, reject) {
		write.directory(directory)
			.then(function() {
				Promise.all(files.map(function(file) {
					return write.file(directory, file);
				})).then(function() {
					resolve();
				}).catch(reject);
			}).catch(reject);
		});
};

module.exports = write.files;