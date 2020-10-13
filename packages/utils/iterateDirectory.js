// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const fsOpendir = promisify(fs.opendir)

/**
 * Creates recursive directory iterator. Call the returned function again and again to receive a file path. Returns `null` when all values have been iterated over.
 * @param {String} directoryPath Absolute directory path.
 * @returns {Function} Recursive directory iterator function.
 */
const iterateDirectory = async function (directoryPath) {
  const directoryResource = await fsOpendir(directoryPath, { encoding: 'utf8' })
  let subIterator = null

  /**
   * Call the function again and again to receive a file path. Returns `null` when all values have been iterated over.
   */
  return async function () {
    if (subIterator) {
      const item = await subIterator()
      if (item) {
        return item
      }

      subIterator = null
    }

    let item
    // Get directory item.
    while (item = await directoryResource.read()) {
      // For directories recursively create an iterator on the sub directory.
      if (item.isDirectory()) {
        // Create new sub iterator.
        subIterator = await iterateDirectory(
          path.resolve(directoryPath, item.name)
        )

        // Get next item from iterator.
        const filePath = await subIterator()

        // Exit early if end of iterator.
        if (!filePath) {
          subIterator = null
          continue
        }

        // Return file path.
        return filePath
      }

      // Construct file path.
      const filePath = path.resolve(directoryPath, item.name)
      return filePath
    }

    // Close directory resource handler.
    await directoryResource.close()
  }
}

export default iterateDirectory
