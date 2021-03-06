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

    // Construct absolute directory path.
    this._directoryPath =
      (this._options.directory && path.isAbsolute(this._options.directory))
        ? this._options.directory
        : path.resolve(process.cwd(), this._options.directory)

    this.directoryOptions = Object.assign(
      this._options.directoryOptions,
      {
        recursive: true,
      }
    )

    this._propertyPath = this._options.property.split('.')
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
    // Construct absolute file path.
    const filePath = path.resolve(this._directoryPath, data.path)

    // Write file to directory.
    await fsWriteFile(
      filePath,
      getByPathSegments(data, this._propertyPath),
      this._options.writeOptions
    )

    return data
  }
}

export default ProcessWritefiles
