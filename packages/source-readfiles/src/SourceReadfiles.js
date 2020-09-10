// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import AsyncIterator from '@hoast/utils/AsyncIterator.js'
import planckmatch from 'planckmatch'

// Import internal modules.
import DirectoryIterator from './utils/DirectoryIterator.js'

// Promisify file system functions.
const fsStat = promisify(fs.stat)
const fsReadFile = promisify(fs.readFile)

class SourceReadfiles extends AsyncIterator {
  constructor(options) {
    super({
      directory: 'src',

      patterns: [],
      patternOptions: {},

      read: true,
      readOptions: {},

      stat: true,
      statOptions: {},
    }, options)

    // Parse patterns into regular expressions.
    if (this._options.patterns && this._options.patterns.length > 0) {
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
  }

  setup () {
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

    // Create result.
    const result = {
      path: filePathRelative,
    }

    // TODO: Start the next two async functions at the same time not one after the other!

    // Read file content.
    if (this._options.read) {
      result.content = await fsReadFile(filePath, this._options.readOptions)
    }

    // Get file stat.
    if (this._options.stat) {
      result.stat = await fsStat(filePath, this._options.statOptions)
    }

    // Return result.
    return result
  }
}

export default SourceReadfiles
