// Import base module.
import BaseProcess from '@hoast/base-process'

// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'

// Promisify file system functions.
const fsMkdir = promisify(fs.mkdir)
const fsWriteFile = promisify(fs.writeFile)

class ProcessWritefiles extends BaseProcess {
  constructor(options) {
    super({
      directory: 'dst',

      directoryOptions: {},

      writeProperty: 'contents',
      writeOptions: {},
    }, options)

    // Construct absolute directory path.
    this._directoryPath =
      (this._options.directory && path.isAbsolute(this._options.directory))
        ? this._options.directory
        : path.resolve(process.cwd(), this._options.directory)

    // Convert dot notation to path segments.
    this._writePath = this._options.writeProperty.split('.')
  }

  async sequential (data) {
    // Construct absolute file path.
    const filePath = path.resolve(this._directoryPath, data.path)

    // Ensure directory exists.
    await fsMkdir(
      path.dirname(filePath),
      Object.assign(
        this._options.directoryOptions,
        {
          recursive: true,
        }
      )
    )

    return data
  }

  async concurrent (data) {
    // Construct absolute file path.
    const filePath = path.resolve(this._directoryPath, data.path)

    // Write file to directory.
    await fsWriteFile(
      filePath,
      getByPathSegments(data, this._writePath),
      this._options.writeOptions
    )

    return data
  }
}

export default ProcessWritefiles
