// Node modules.
const fs = require(`fs`),
	path = require(`path`);
// Dependency module.
const isutf8 = require(`isutf8`);

/**
 * Read the content of the file.
 * @param {object} directory The directory path of the file.
 * @param {object} file The file data.
 */
const read = function(directory, file) {
	return new Promise(function(resolve, reject) {
		fs.readFile(path.join(directory, file.path), function(error, buffer) {
			if (error) {
				return reject(error);
			}
			return resolve(
				Object.assign(file, {
					// If file is utf8 store it as a string.
					content: isutf8(buffer) ? {
						type: `string`,
						data: buffer.toString()
					} : buffer,
				})
			);
		});
	});
};

/**
 * Read module which reads the content of each file.
 */
module.exports = function() {
	/**
	 * Reads data from all the given files.
	 * @param {object} hoast Hoast instance.
	 * @param {object[]} files An array of file data.
	 */
	return async function(hoast, files) {
		await Promise.all(files.map(function(file) {
			return read(path.join(hoast.directory, hoast.options.source), file);
		}));
	};
};