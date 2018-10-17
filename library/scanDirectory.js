// Node modules.
const fs = require(`fs`),
	path = require(`path`);
// Custom modules.
const match = require(`./match`);

/**
 * Scan a directory recursively.
 * @param {RegExps|Array} expression Regular Expression for matching with file paths.
 * @param {Boolean} all Whether all patterns need to match.
 * @param {String} directory Directory name.
 * @param {String[]} arguments File path, possibly split up in segments but in order.
 */
const scanDirectory = function(expressions, all, directory) {
	// Create inner scan method that can be recursively called whilst still having access to the 'expressions' and 'all' parameters.
	const scan = async function(directory, relative) {
		// Create absolute path.
		let absolute;
		if (relative) {
			absolute = path.join(directory, relative);
		} else {
			relative = ``;
			absolute = directory;
		}
		
		return new Promise(function(resolve, reject) {
			// Retrieve file status.
			fs.lstat(absolute, function(error, stats) {
				if (error) {
					return reject(error);
				}
				
				// If it is a file resolve with its stats.
				if (stats.isFile()) {
					resolve({
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
					return;
				}
				
				// Read directory and invoke this method for all items in it.
				fs.readdir(absolute, function(error, files) {
					if (error) {
						return reject(error);
					}
					
					// Recursively call for each file in subdirectory.
					Promise.all(files.map(function(file) {
						
						// Create new relative path.
						const newRelative = path.join(relative, file);
						
						// Check if path still matches expression.
						if (!match(newRelative, expressions, all)) {
							return;
						}
						
						// Recursively call this again.
						return scan(directory, newRelative);
					})).then(function(result) {
						// Flatten array before returning.
						resolve(result.reduce(function(previous, current) {
							if (!current) {
								return previous;
							} else if (Array.isArray(current)) {
								return previous.concat(current);
							} else {
								previous.push(current);
								return previous;
							}
						}, []));
					}).catch(reject);
				});
			});
		});
	};
	
	// Return first call of scan.
	return scan(directory);
};

module.exports = scanDirectory;