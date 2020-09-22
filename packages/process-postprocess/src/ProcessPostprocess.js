// Import base class.
import BaseProcessor from '@hoast/base-processor'

// import external modules.

class ProcessProcess extends BaseProcessor {
  constructor(options) {
    super({
      css: true,
      cssOptions: {},

      html: true,
      htmlOptions: {},

      js: true,
      jsOptions: {},
    }, options)
  }

  concurrent () {
    // TODO:
  }
}

export default ProcessProcess
