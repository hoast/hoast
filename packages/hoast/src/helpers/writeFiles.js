// Node modules.
const fs = require('fs')
const path = require('path')
// Custom modules
const createDirectory = require('./createDirectory')

/**
 * Writes each file to the directory.
 * @param {string} directory Directory path.
 * @param {object | Object[]} files File data or Array of file data.
 */
const writeFiles = function(directory, files) {
  if (Array.isArray(files)) {
    // If array iterate over each file.
    return Promise.all(
      files.map(function(file) {
        // Write file to destination.
        return writeFile(directory, file)
      })
    )
  }

  // Write file to destination.
  return writeFile(directory)
}

/**
 * Write the file to the directory.
 * @param {string} directory Directory path.
 * @param {object} file File data.
 */
const writeFile = writeFiles.single = function(directory, file) {
  return new Promise(function(resolve, reject) {
    // Ensure directory exists.
    createDirectory(path.join(directory, path.dirname(file.path)))
      .then(function() {
        // Open file, 'w' flag means it opens file for writing, and it creates (if it does not exist) or truncated (if it exists) the file.
        fs.open(path.join(directory, file.path), 'w', function(error, fileDescriptor) {
          if (error) {
            return reject(error)
          }

          // Write content to newly created file.
          fs.writeFile(fileDescriptor, file.content.type === 'string' ? file.content.data : file.content, function(error) {
            if (error) {
              return reject(error)
            }

            // Close file.
            fs.close(fileDescriptor, function(error) {
              if (error) {
                return reject(error)
              }

              // Resolve promise without any issue.
              resolve()
            })
          })
        })
      }).catch(reject)
  })
}

module.exports = writeFiles
