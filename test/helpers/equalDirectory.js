// Node modules.
const path = require(`path`);
// Custom modules.
const constructTree = require(`./constructTree`),
	equalFile = require(`./equalFile`);

/**
 * Compares the content of each file in the directory and sub-directories.
 * @param {object} t Ava instance.
 * @param {string} actualDirectory Directory path of directory to compare to.
 * @param {string} expectedDirectory Directory path of directory to compare with.
 * @param {object} tree File tree of directory to compare.
 */
const equalDirectory = async function(t, actualDirectory, expectedDirectory, tree) {
	if (!tree) {
		// Create actual file tree.
		tree = await constructTree(actualDirectory);
		// Create and compare file trees.
		t.deepEqual(tree, await constructTree(expectedDirectory));
	} else {
		// Update directory paths.
		actualDirectory = path.join(actualDirectory, tree.path);
		expectedDirectory = path.join(expectedDirectory, tree.path);
	}
	
	// Compare the content of each directory.
	await Promise.all(
		tree.files.map(function(file) {
			// If file is a string then it refers to the name of a file in the current directory.
			if (typeof(file) === `string`) {
				// Therefore compare each file.
				return equalFile(t, path.join(actualDirectory, file), path.join(expectedDirectory, file));
			}
			// Otherwise it is a file tree node of a sub directory.
			// Therefore call this function recursively.
			return equalDirectory(t, actualDirectory, expectedDirectory, file);
		})
	);
};

module.exports = equalDirectory;