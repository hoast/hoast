// Node modules.
const { lstat, readdir } = require(`fs`),
	{ join } = require(`path`);

/**
 * Recursive flattening of an array.
 * @param {Array} array The multi-depth array.
 */
const flatten = function(array) {
	return array.reduce(function(array, value) {
		return array.concat(Array.isArray(value) ? flatten(value) : value);
	}, []);
};

/**
 * Scan a file recursively.
 * @param {String} directory directory name.
 * @param {String[]} arguments file path, possibly split up in segments but in order.
 */
const scan = function(directory) {
	let absolute = join(...arguments),
		relative = join(...Array.prototype.slice.call(arguments, 1));
	return new Promise(function(resolve, reject) {
		lstat(absolute, function(error, stats) {
			if (error) {
				return reject(error);
			}
			if (stats.isDirectory()) {
				// Read directory and invoke this method for all items in it.
				readdir(absolute, function(error, files) {
					if (error) {
						return reject(error);
					}
					Promise.all(files.map(function(file) {
						return scan(directory, relative, file);
					})).then(function(result) {
						resolve(flatten(result));
					}).catch(reject);
				});
			} else {
				// Return stats.
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
			}
		});
	});
};

module.exports = scan;