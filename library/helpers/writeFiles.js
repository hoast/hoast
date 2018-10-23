// Node modules.
const fs = require(`fs`),
	path = require(`path`);
// Custom modules
const createDirectory = require(`./createDirectory`);

/**
 * Writes each file to the directory.
 * @param {String} directory Directory path.
 * @param {Object} files File dataset.
 */
const writeFiles = function(directory, files) {
	return Promise.all(
		files.map(function(file) {
			return writeFiles.single(directory, file);
		})
	);
};

/**
 * Write the file to the directory.
 * @param {String} directory Directory path.
 * @param {Object} file File data.
 */
writeFiles.single = function(directory, file) {
	return new Promise(function(resolve, reject) {
		createDirectory(path.join(directory, path.dirname(file.path)))
			.then(function() {
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