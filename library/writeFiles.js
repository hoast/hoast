// Node modules.
const fs = require(`fs`),
	path = require(`path`);
// Custom modules
const createDirectory = require(`./createDirectory`);

const write = {};

/**
 * Write the file to the directory.
 * @param {String} directory Directory path.
 * @param {Object} file File data.
 */
write.file = function(directory, file) {
	return new Promise(function(resolve, reject) {
		createDirectory(path.join(directory, path.dirname(file.path)))
			.then(function() {
				if (!file.content) {
					throw {
						message: `hoast.write: No content found on file, read module needs to be called before process.`
					};
				}
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

/**
 * Writes each file to the directory.
 * @param {String} directory Directory path.
 * @param {Object} files File dataset.
 */
write.files = function(directory, files) {
	return new Promise(function(resolve, reject) {
		createDirectory(directory)
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