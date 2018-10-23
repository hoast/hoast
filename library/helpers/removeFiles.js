// Node modules.
const fs = require(`fs`),
	path = require(`path`);

/**
 * Remove directories and/or files.
 * @param {String[]} files Paths of directories and\or files.
 */
const removeFiles = function(files) {
	// If array iterate over each file.
	return Promise.all(
		files.map(function(file) {
			return removeFiles.single(file);
		})
	);
};

/**
 * Remove directory or file.
 * @param {String} file Path of directory or file.
 */
removeFiles.single = function(file) {
	return new Promise(function(resolve, reject) {
		fs.lstat(file, function(error, stats) {
			if (error) {
				if (error.code === `ENOENT`) {
					// File does not exist.
					return resolve();
				}
				return reject(error);
			}
			
			if (stats.isFile()) {
				// If file unlink it.
				fs.unlink(file, function (error) {
					if (error) {
						return reject(error);
					}
					resolve();
				});
			} else {
				// For readability use 'directory' instead if 'file'
				const directory = file;
				// Get All files within the directory.
				fs.readdir(directory, function(error, directoryFiles) {
					if (error) {
						return reject(error);
					}
					
					// If directory then remove each directory and\or file within, then remove this directory.
					Promise.all(directoryFiles.map(function(directoryFile) {
						return removeFiles.single(path.join(directory, directoryFile));
					})).then(function() {
						// Remove the now empty directory.
						fs.rmdir(directory, function(error) {
							if (error) {
								return reject(error);
							}
							resolve();
						});
					}).catch(reject);
				});
			}
		});
	});
};

module.exports = removeFiles;