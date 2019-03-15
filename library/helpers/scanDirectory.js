// Node modules.
const fs = require(`fs`),
	path = require(`path`);
// Custom modules.
const match = require(`./matchExpressions`);

/**
 * Scan a directory recursively.
 * @param {string} directory Directory name.
 * @param {RegExps|RegExp[]} expression Regular Expression for matching with file paths.
 * @param {boolean} all Whether all patterns need to match.
 */
const scanDirectory = function(directory, expressions, all = false) {
	const scanFile = function(relative) {
		// Create absolute path to scanned directory or file.
		const absolute = relative ? path.join(directory, relative) : directory;
		
		return new Promise(function(resolve, reject) {
			// Retrieve file status.
			fs.lstat(absolute, function(error, stats) {
				if (error) {
					return reject(error);
				}
				
				// If it is a file resolve with its stats.
				if (stats.isFile()) {
					if (!relative) {
						return reject(`hoast/helpers/scanDirectory: Directory parameter should lead towards a directory not a file.`);
					}
					
					return resolve({
						path: relative,
						stats: {
							dev: stats.dev,
							ino: stats.ino,
							mode: stats.mode,
							nlink: stats.nlink,
							uid: stats.uid,
							gid: stats.gid,
							rdev: stats.rdev,
							size: stats.size,
							blksize: stats.blksize,
							blocks: stats.blocks,
							atimeMs: stats.atimeMs,
							mtimeMs: stats.mtimeMs,
							ctimeMs: stats.ctimeMs,
							birthtimeMs: stats.birthtimeMs
						}
					});
				}
				
				// Read directory and invoke this method for all items in it.
				fs.readdir(absolute, function(error, files) {
					if (error) {
						return reject(error);
					}
					
					// Recursively call for each file in subdirectory.
					Promise.all(files.map(function(file) {
						// Create new relative path.
						const newRelative = relative ? path.join(relative, file) : file;
						
						// Check if path still matches expression.
						if (!match(newRelative, expressions, all)) {
							return;
						}
						
						// Recursively call this again.
						return scanFile(newRelative);
					})).then(function(result) {
						// Flatten array before returning.
						resolve(result.reduce(function(previous, current) {
							if (!current) {
								return previous;
							} else if (Array.isArray(current)) {
								return previous.concat(current);
							}
							previous.push(current);
							return previous;
						}, []));
					}).catch(reject);
				});
			});
		});
	};
	
	// Return first call of scan.
	return scanFile();
};

module.exports = scanDirectory;