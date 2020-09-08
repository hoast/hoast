// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import merge from '@hoast/utils/merge.js'
import planckmatch from 'planckmatch'
import SourceSequential from '@hoast/utils/SourceSequential.js'

// Import internal modules.
import DirectoryIterator from './utils/DirectoryIterator.js'

// Promisify file system functions.
const fsReadFile = promisify(fs.readFile)

class SourceFilesystem extends SourceSequential {
  constructor(options) {
    super()

    // Store options.
    this._options = merge({
      directory: 'src',
      content: true,

      patterns: [],
      patternOptions: {},
      readOptions: {},
    }, options)
  }

  async next () {
    console.log('next')

    if (!this._isInitialized) {
      this._isInitialized = true

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

    // Check if it should wait.
    if (this.hold) {
      console.log('hold')
      // Add resolver to promises.
      const instance = this
      await new Promise((resolve, reject) => {
        instance._promises.push({
          resolve,
          reject,
        })
      })
      return
    }

    console.log('don\'t hold')
    // Call and wait for next directly.
    await this._next()
  }

  async _tryShift () {
    console.log('_shift')
    // Set hold back to false.
    if (this._promises.length === 0) {
      this.hold = false
    }

    console.log('resolve')
    const { resolve, reject } = this._promises.shift()
    try {
      resolve(await this._next())
    } catch (error) {
      reject(error)
    }
  }

  async _next () {
    console.log('_next')

    // Set hold to true.
    this.hold = true

    let filePath
    // Get next file path.
    while (filePath = await this._directoryIterator.next()) {
      // Make file path relative.
      const filePathRelative = path.relative(this._directoryPath, filePath)
      console.log('filePath', filePathRelative)

      // Check if path matches the patterns.
      if (this._expressions) {
        // Skip if it does not matches.
        const matches = this._options.patternOptions.all ? planckmatch.match.all(filePathRelative, this._expressions) : planckmatch.match.any(filePathRelative, this._expressions)
        if (!matches) {
          continue
        }
      }

      console.log('try _shift')
      // Try and shift.
      this._tryShift()

      // Get file content.
      const content = await fsReadFile(filePath, this._options.readOptions)

      console.log('return result')
      // Return result.
      return {
        path: filePathRelative,
        content: content,
      }
    }

    // Set done.
    console.log('Finished soure iteration.')
    this.done = true

    // TODO:
    // Imidiatly resolve all quued promises!
  }
}

export default SourceFilesystem
