// Import base module.
import BaseSourcer from '@hoast/base-sourcer'

class SourceCustom extends BaseSourcer {
  constructor(options) {
    super({
      initialize: null,
      sequential: null,
      concurrent: null,
      final: null,
    }, options)

    if (this._options.initialize) {
      this.initialize = this._options.initialize
    }

    if (this._options.sequential) {
      this.sequential = this._options.sequential
    }

    if (this._options.concurrent) {
      this.concurrent = this._options.concurrent
    }

    if (this._options.final) {
      this.final = this._options.final
    }
  }
}

export default SourceCustom
