// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import BasePackage from '@hoast/base-package'

// Promisify file system functions.
const fsMkdir = promisify(fs.mkdir)
const fsWriteFile = promisify(fs.writeFile)

// TODO: Rework with new base-processor so filepath making happens in sequential bit.

class ProcessWritefiles extends BasePackage {
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
  }

  async next (app, data) {
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

    // Write file to directory.
    await fsWriteFile(
      filePath,
      data.content,
      this._options.writeOptions
    )
  }
}

export default ProcessWritefiles
