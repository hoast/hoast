// Import external modules.
import BasePackage from '@hoast/utils/BasePackage.js'

class ProcessTransform extends BasePackage {
  constructor(options) {
    super({
      field: 'extensions',
    }, options)
  }

  process (app, data) {
    // TODO:
  }
}

export default ProcessTransform
