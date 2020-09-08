// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const fsOpendir = promisify(fs.opendir)

class DirectoryIterator {
  constructor(_directoryPath) {
    console.log(_directoryPath)
    this._directoryPath = _directoryPath
  }

  async next () {
    if (!this._initialized) {
      this._initialized = true
      // Open directory.
      console.log(this._directoryPath)
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
      console.log(item)
      // For directories recursively create an iterator on the sub directory.
      if (item.isDirectory()) {
        this._subIterator = await new DirectoryIterator(
          path.resolve(this._directoryPath, item.name)
        )

        item = await this._subIterator.next()

        if (!item) {
          this._subIterator = null
          continue
        }
      }

      // Construct file path.
      const filePath = path.resolve(this._directoryPath, item.name)
      return filePath
    }

    // Close directory resource handler.
    console.log('Close directory resource.')
    await this._directoryResource.close()
  }
}

export default DirectoryIterator
