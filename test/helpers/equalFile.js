// Node modules.
const fs = require(`fs`);

/**
 * fs.readFile wrapper to make it a promise.
 * @param {string} filePath Path to file who's content will be read.
 */
const readFile = function(filePath) {
	return new Promise(function(resolve, reject) {
		fs.readFile(filePath, function(error, data) {
			if (error) {
				return reject(error);
			}
			
			return resolve(data);
		});
	});
};

/**
 * Reads and compares file content.
 * @param {object} t Ava instance.
 * @param {string} actualFile File path of file to compare to.
 * @param {string} expectedFile File path of file to compare with.
 */
const equalFile = async function(t, actualFile, expectedFile) {
	try {
		// Read each file and compare its content.
		t.deepEqual(await readFile(actualFile), await readFile(expectedFile));
	} catch(error) {
		t.fail(error);
	}
};

module.exports = equalFile;