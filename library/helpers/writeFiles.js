// Node modules.
const fs = require(`fs`),
	path = require(`path`);
// Custom modules
const createDirectory = require(`./createDirectory`);

/**
 * Writes each file to the directory.
 * @param {String} directory Directory path.
 * @param {Object | Object[]} files File data or Array of file data.
 */
const writeFiles = function(directory, files) {
	if (Array.isArray(files)) {
		// If array iterate over each file.
		return Promise.all(
			files.map(function(file) {
				// Write file to destination.
				return writeFile(directory, file);
			})
		);
	}
	
	// Write file to destination.
	return writeFile(directory);
};

/**
 * Write the file to the directory.
 * @param {String} directory Directory path.
 * @param {Object} file File data.
 */
const writeFile = writeFiles.single = function(directory, file) {
	return new Promise(function(resolve, reject) {
		// Ensure directory exists.
		createDirectory(path.join(directory, path.dirname(file.path)))
			.then(function() {
				// Write file to destination.
				fs.writeFile(
					path.join(directory, file.path),
					file.content.type === `string` ? file.content.data : file.content,
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

module.exports = writeFiles;