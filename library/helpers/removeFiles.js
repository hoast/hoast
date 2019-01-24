// Node modules.
const fs = require(`fs`),
	path = require(`path`);

/**
 * Remove directories and/or files.
 * @param {string | String[]} files Path(s) of directories and\or files.
 */
const removeFiles = function(files) {
	if (Array.isArray(files)) {
		// If array iterate over each file.
		return Promise.all(
			files.map(function(file) {
				// Remove file from disk.
				return removeFile(file);
			})
		);
	}
	
	// Remove file from disk.
	return removeFile(files);
};

/**
 * Remove directory or file.
 * @param {string} file Path of directory or file.
 */
const removeFile = removeFiles.single = function(file) {
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
					
					// Prefix files with absolute directory.
					const absoluteFiles = directoryFiles.map(function(directoryFile) {
						return path.join(directory, directoryFile);
					});
					
					// If directory then remove each directory and\or file within, then remove this directory.
					removeFiles(absoluteFiles)
						.then(function() {
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