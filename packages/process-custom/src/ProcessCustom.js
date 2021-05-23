// Import base class.
import BaseProcess from '@hoast/base-process'

class ProcessCustom extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      initialize: null,
      sequential: null,
      concurrent: null,
      final: null,
    }, options)
    options = this.getOptions()

    if (options.initialize) {
      this.initialize = options.initialize
    }

    if (options.sequential) {
      this.sequential = options.sequential
    }

    if (options.concurrent) {
      this.concurrent = options.concurrent
    }

    if (options.final) {
      this.final = options.final
    }
  }
}

export default ProcessCustom
