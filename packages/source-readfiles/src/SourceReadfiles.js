// Import base module.
import BaseSource from '@hoast/base-source'

// Import build-in modules.
import fs from 'fs'
import path from 'path'

// Import utility modules.
import iterateDirectory from '@hoast/utils/iterateDirectory.js'
import planckmatch from 'planckmatch'
import { trimStart } from '@hoast/utils/trim.js'

class SourceReadfiles extends BaseSource {
  /**
   * Create package instance.
   * @param  {Object} options Options objects.
   */
  constructor(options) {
    super({
      directory: null,
      filterPatterns: null,
      filterOptions: {
        all: false,
      },
      readOptions: {
        encoding: 'utf8',
      },
      statOptions: {},
    }, options)
    options = this.getOptions()

    // Parse patterns into regular expressions.
    if (options.filterPatterns && options.filterPatterns.length > 0) {
      this._expressions = options.filterPatterns.map(pattern => {
        return planckmatch.parse(pattern, options.filterOptions, true)
      })
    }
  }

  async initialize () {
    const libraryOptions = this.getLibrary().getOptions()
    const options = this.getOptions()

    // Construct absolute directory path.
    if (options.directory) {
      this._directoryPath =
        (options.directory && path.isAbsolute(options.directory))
          ? options.directory
          : path.resolve(libraryOptions.directory, options.directory)
    } else {
      this._directoryPath = libraryOptions.directory
    }

    // Create directory iterator.
    this._directoryIterator = await iterateDirectory(this._directoryPath)
  }

  async sequential () {
    const library = this.getLibrary()
    const options = this.getOptions()

    let filePath
    // Get next file path.
    while (filePath = await this._directoryIterator()) {
      if (library.isWatching()) {
        // Skip if file hasn't changed.
        if (!library.hasChanged(filePath)) {
          continue
        }
        library.clearAccessed(filePath)
      }

      // Make file path relative.
      const filePathRelative = path.relative(this._directoryPath, filePath)

      // Check if path matches the patterns.
      if (this._expressions) {
        // Skip if it does not matches.
        const matches = options.filterOptions.all
          ? planckmatch.match.all(filePathRelative, this._expressions)
          : planckmatch.match.any(filePathRelative, this._expressions)
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
    const library = this.getLibrary()
    const options = this.getOptions()

    // Deconstruct parameters.
    const [filePath, filePathRelative] = data

    if (library.isWatching()) {
      // Mark file as accessed.
      library.addAccessed(filePath)
    }

    // Construct URI for file.
    let uri = trimStart(filePath, path.sep)
    if (path.sep !== '/') {
      uri = uri.replace(path.sep, '/')
    }

    // Create result.
    const result = {
      path: filePathRelative,
      sourceIdentifier: filePath,
      sourceType: 'filesystem',
      uri: 'file://' + uri,
    }

    // Store promises here.
    const promises = []

    // Read file content.
    if (options.readOptions) {
      promises.push(
        new Promise((resolve, reject) => {
          fs.readFile(filePath, options.readOptions, (error, data) => {
            if (error) {
              reject(error)
              return
            }

            result.contents = data
            resolve()
          })
        }),
      )
    }

    // Get file stat.
    if (options.statOptions) {
      promises.push(
        new Promise((resolve, reject) => {
          fs.stat(filePath, options.statOptions, (error, data) => {
            if (error) {
              reject(error)
              return
            }

            result.stat = data
            resolve()
          })
        }),
      )
    }

    // Wait for all the promises to finish.
    if (promises.length > 0) {
      await Promise.all(promises)
    }

    // Return result.
    return result
  }

  final () {
    super.final()

    this._directoryPath = null
    this._directoryIterator = null
  }
}

export default SourceReadfiles
