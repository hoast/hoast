// Import build-in modules.
import fs from 'fs'
import path from 'path'

// Import external modules.
import BaseSourcer from '@hoast/base-sourcer'
import DirectoryIterator from '@hoast/utils/DirectoryIterator.js'
import planckmatch from 'planckmatch'
import { trimStart } from '@hoast/utils/trim.js'

class SourceReadfiles extends BaseSourcer {
  constructor(options) {
    super({
      directory: 'src',

      patterns: null,
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
    this._directoryPath =
      (this._options.directory && path.isAbsolute(this._options.directory))
        ? this._options.directory
        : path.resolve(process.cwd(), this._options.directory)
  }

  initialize () {
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

  async concurrent (data) {
    // Exit early if invalid parameters.
    if (!data) {
      return
    }

    // Deconstruct paramters.
    const [filePath, filePathRelative] = data

    // Get extensions of file path.
    // Get file name with extensions.
    let extensions = filePath.split('/').pop()
    // Split file and each extension apart.
    extensions = extensions.split('.')
    // Remove file name.
    extensions.shift()

    // Create result.
    const result = {
      cwd: this._directoryPath,
      uri: 'file://' + trimStart(filePath, path.sep).replace(path.sep, '/'),
      path: filePathRelative,
      extensions: extensions,
    }

    // Store promises here.
    const promises = []

    // Read file content.
    if (this._options.read) {
      promises.push(
        new Promise((resolve, reject) => {
          fs.readFile(filePath, this._options.readOptions, (error, data) => {
            if (error) {
              reject(error)
              return
            }

            result.contents = data
            resolve()
          })
        })
      )
    }

    // Get file stat.
    if (this._options.stat) {
      promises.push(
        new Promise((resolve, reject) => {
          fs.stat(filePath, this._options.statOptions, (error, data) => {
            if (error) {
              reject(error)
              return
            }

            result.stat = data
            resolve()
          })
        })
      )
    }

    // Wait for all the promises to finish.
    if (promises.length > 0) {
      await Promise.all(promises)
    }

    // Return result.
    return result
  }
}

export default SourceReadfiles
