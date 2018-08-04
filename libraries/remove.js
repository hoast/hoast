// Node modules.
const fs = require('fs'),
	  { join } = require('path');

const remove = {};

/**
 * Remove file at path.
 * @param {String[]} arguments file path, possibly split in segments.
 */
remove.file = function() {
	const file = join(...arguments);
	return new Promise(function(resolve, reject) {
		fs.lstat(file, function(error, stats) {
			if (error) {
				if (error.code === 'ENOENT') {
					// Item does not exist.
					return resolve();
				}
				return reject(error);
			}
			if (stats.isDirectory()) {
				resolve(remove.directory(file));
			} else {
				fs.unlink(file, function (error) {
					if (error) {
						return reject(error);
					}
					resolve();
				});
			}
		});
	});
};

/**
 * Remove all files at path.
 * @param {String[]} arguments directory path, possibly split in segments.
 */
remove.directory = function() {
	const directory = join(...arguments);
	return new Promise(function(resolve, reject) {
		fs.access(directory, fs.constants.F_OK | fs.constants.W_OK, function(error) {
			if (error) {
				if (error.code === 'ENOENT') {
					resolve();
				}
				return reject(error);
			}
			fs.readdir(directory, function(error, files) {
				if (error) {
					return reject(error);
				}
				Promise.all(files.map(function(file) {
					return remove.file(directory, file);
				})).then(function() {
					fs.rmdir(directory, function(error) {
						if (error) {
							return reject(error);
						}
						resolve();
					});
				}).catch(reject);
			});
		});
	});
};

module.exports = remove.file;