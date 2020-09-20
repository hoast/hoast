// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import BaseProcessor from '@hoast/base-processor'

// Promisify file system functions.
const fsMkdir = promisify(fs.mkdir)
const fsWriteFile = promisify(fs.writeFile)

class ProcessWritefiles extends BaseProcessor {
  constructor(options) {
    super({
      directory: 'dst',

      directoryOptions: {},

      writeOptions: {},
    }, options)

    // Construct absolute directory path.
    this._directoryPath =
      (this._options.directory && path.isAbsolute(this._options.directory))
        ? this._options.directory
        : path.resolve(process.cwd(), this._options.directory)

    // TODO: Add write dot notation path.
  }

  async sequential (data) {
    // Construct absolute file path.
    const filePath = path.resolve(this._directoryPath, data.path)

    // Ensure directory exists.
    await fsMkdir(
      path.dirname(filePath),
      Object.assign(
        this._options.directoryOptions.mode,
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
      data.content,
      this._options.writeOptions
    )

    return data
  }
}

export default ProcessWritefiles
