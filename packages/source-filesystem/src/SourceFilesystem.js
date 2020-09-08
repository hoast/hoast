// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import merge from '@hoast/utils/merge.js'
import planckmatch from 'planckmatch'
import ConcurrentIterator from '@hoast/utils/ConcurrentIterator.js'

// Import internal modules.
import DirectoryIterator from './utils/DirectoryIterator.js'

// Promisify file system functions.
const fsReadFile = promisify(fs.readFile)

class SourceFilesystem extends ConcurrentIterator {
  constructor(options) {
    super()

    // Store options.
    this._options = merge({
      directory: 'src',
      content: true,

      patterns: [],
      patternOptions: {},
      readOptions: {
        encoding: 'utf8',
      },
    }, options)
  }

  setup () {
    // Parse patterns into regular expressions.
    if (this._options.patterns) {
      this._expressions = this._options.patterns.map(pattern => {
        return planckmatch.parse(pattern, this._options.patternOptions, true)
      })
    }

    // Construct absolute directory path.
    if (path.isAbsolute(this._options.directory)) {
      this._directoryPath = this._options.directory
    } else {
      this._directoryPath = path.resolve(process.cwd(), this._options.directory)
    }

    // Create directory iterator.
    this._directoryIterator = new DirectoryIterator(this._directoryPath)
  }

  async sequential () {
    let filePath
    // Get next file path.
    while (filePath = await this._directoryIterator.next()) {
      // Make file path relative.
      const filePathRelative = path.relative(this._directoryPath, filePath)

      // Check if path matches the patterns.
      if (this._expressions) {
        // Skip if it does not matches.
        const matches = this._options.patternOptions.all ? planckmatch.match.all(filePathRelative, this._expressions) : planckmatch.match.any(filePathRelative, this._expressions)
        if (!matches) {
          continue
        }
      }

      return [filePath, filePathRelative]
    }

    this.exhausted = true
  }

  async concurrent (values) {
    // Exit early if invalid parameters.
    if (!values) {
      return
    }

    // Deconstruct paramters.
    const [filePath, filePathRelative] = values

    // Get file content.
    const content = await fsReadFile(filePath, this._options.readOptions)

    // Return result.
    return {
      path: filePathRelative,
      content: content,
    }
  }
}

export default SourceFilesystem
