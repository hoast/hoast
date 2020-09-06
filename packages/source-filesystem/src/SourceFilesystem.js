// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import { parse, match } from 'planckmatch'

// Promisify file system functions.
const fsOpenDir = promisify(fs.opendir)
const fsReadFile = promisify(fs.readFile)

class SourceFilesystem {
  constructor(options) {
    // Store options.
    this._options = Object.assign({
      directory: 'src',
      patterns: [],
      patternOptions: {},
    }, options)
  }

  async next () {
    if (!this.initialized) {
      this.initialized = true

      // Parse patterns into regular expressions.
      if (this._options.patterns) {
        this._expressions = this._options.patterns.map(pattern => {
          return parse(pattern, this._options.patternOptions, true)
        })
      }

      // Construct absolute directory path.
      if (path.isAbsolute(this._options.directory)) {
        this._directoryPath = this._options.directory
      } else {
        this._directoryPath = path.resolve(process.cwd(), this._options.directory)
      }

      // Create directory iterator.
      this._directoryIterator = SourceFilesystem.createDirectoryIterator(this._directoryPath)
    }

    let filePath
    // Get next file path.
    while (filePath = await this._directoryIterator()) {
      // Make file path relative.
      const filePathRelative = path.relative(this._directoryPath, filePath)

      // Check if path matches the patterns.
      if (this._expressions) {
        // Skip if it does not matches.
        const matches = this._options.patternOptions.all ? match.all(filePathRelative, this._expressions) : match.any(filePathRelative, this._expressions)
        if (!matches) {
          continue
        }
      }

      // Get file content.
      const content = await fsReadFile(filePath)

      // Return result.
      return {
        path: filePathRelative,
        content: content,
      }
    }

    // Set done.
    this.done = true
  }

  static async createDirectoryIterator (directory) {
    // Sub iterator for recursive calls.
    let subIterator

    // Open directory.
    const resource = await fsOpenDir(directory, { encoding: 'utf8' })

    return async function () {
      // If sub iterator exists try and get item from that first.
      if (subIterator) {
        const item = await subIterator()
        if (item) {
          return item
        }

        subIterator = null
      }

      let item
      // Get directory item.
      while (item = await resource.read()) {
        // For directories recursively create an iterator on the sub directory.
        if (item.isDirectory()) {
          subIterator = await SourceFilesystem.createDirectoryIterator(
            path.resolve(directory, item.name)
          )

          item = await subIterator()

          if (!item) {
            subIterator = null
            continue
          }
        }

        // Construct file path.
        const filePath = path.resolve(directory, item.name)
        return filePath
      }

      // Close directory resource handler.
      await resource.close()
    }
  }
}

export default SourceFilesystem
