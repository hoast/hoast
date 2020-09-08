// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const fsOpendir = promisify(fs.opendir)

class DirectoryIterator {
  constructor(_directoryPath) {
    this._directoryPath = _directoryPath

    this._isInitialized = false
  }

  async next () {
    if (!this._isInitialized) {
      this._isInitialized = true

      // Open directory.
      this._directoryResource = await fsOpendir(this._directoryPath, { encoding: 'utf8' })
    }

    // If sub iterator exists try and get item from that first.
    if (this._subIterator) {
      const item = await this._subIterator.next()
      if (item) {
        return item
      }

      this._subIterator = null
    }

    let item
    // Get directory item.
    while (item = await this._directoryResource.read()) {
      // For directories recursively create an iterator on the sub directory.
      if (item.isDirectory()) {
        // Create new sub iterator.
        this._subIterator = await new DirectoryIterator(
          path.resolve(this._directoryPath, item.name)
        )

        // Get next item from iterator.
        const filePath = await this._subIterator.next()

        // Exit early if end of iterator.
        if (!filePath) {
          this._subIterator = null
          continue
        }

        // Return file path.
        return filePath
      }

      // Construct file path.
      const filePath = path.resolve(this._directoryPath, item.name)
      return filePath
    }

    // Close directory resource handler.
    await this._directoryResource.close()
  }
}

export default DirectoryIterator
