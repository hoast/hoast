import BasePackage from '@hoast/utils/BasePackage.js'

class ProcessWritefiles extends BasePackage {
  constructor(options) {
    super({
      directory: 'dst',
    }, options)
  }

  async process (app, data) {
    // TODO: Write to the file system.
  }
}

export default ProcessWritefiles
