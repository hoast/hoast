// Import base class.
import BaseProcessor from '@hoast/base-processor.js'
// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

class BaseTransformer extends BaseProcessor {
  constructor(...options) {
    super(...options)

    // Convert dot notation to path segments.
    if (this._options.field) {
      this._fieldPath = this._options.field.split('.')
    }
  }

  async process (app, data) {
    // Get value at field.
    let value = this._fieldPath ? getByPathSegments(data, this._fieldPath) : data

    // Transform value.
    value = await this.transform(app, data, value)

    // Set value back to field.
    data = this._fieldPath ? setByPathSegments(data, this._fieldPath, value) : value

    // Return resulting data.
    return data
  }

  /*
   * Methods to extends when using this as your base class.
   * async setup (app) { }
   * async transform (app, data, value) { }
   */
}

export default BaseTransformer
