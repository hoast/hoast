// Import base module.
import BaseProcess from '@hoast/base-process'
import { getByPathSegments } from '@hoast/utils/get.js'

// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Promisify file system functions.
const fsMkdir = promisify(fs.mkdir)
const fsWriteFile = promisify(fs.writeFile)

class ProcessWritefiles extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      directory: 'dst',
      directoryOptions: {},

      property: 'contents',
      writeOptions: {
        encoding: 'utf8',
      },
    }, options)
    options = this.getOptions()

    this.directoryOptions = Object.assign(
      options.directoryOptions,
      {
        recursive: true,
      }
    )

    this._propertyPath = options.property.split('.')
  }

  initialize () {
    const libraryOptions = this.getLibrary().getOptions()
    const options = this.getOptions()

    if (!this._directoryPath) {
      // Construct absolute directory path.
      this._directoryPath =
        (options.directory && path.isAbsolute(options.directory))
          ? options.directory
          : path.resolve(libraryOptions.directory, options.directory)
    }
  }

  async sequential (data) {
    // Construct absolute file path.
    const filePath = path.resolve(this._directoryPath, data.path)

    // Ensure directory exists.
    await fsMkdir(
      path.dirname(filePath),
      this.directoryOptions
    )

    return data
  }

  async concurrent (data) {
    const options = this.getOptions()

    // Construct absolute file path.
    const filePath = path.resolve(this._directoryPath, data.path)

    // Write file to directory.
    await fsWriteFile(
      filePath,
      getByPathSegments(data, this._propertyPath),
      options.writeOptions
    )

    return data
  }
}

export default ProcessWritefiles
