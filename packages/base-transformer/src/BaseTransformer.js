// Import base class.
import BaseProcessor from '@hoast/base-processor.js'
// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

class BaseTransformer extends BaseProcessor {
  constructor(...options) {
    super(...options)

    // Chechk if field option exists.
    if (!this._options.field) {
      this._logger.error('Required option "field" not set. See documention for more infromation.')
    }
    // Convert dot notation to path segments.
    this._fieldPath = this._options.field.split('.')
  }

  async process (app, data) {
    // Get value at field.
    let value = getByPathSegments(data, this._fieldPath)

    // Transform value.
    value = await this.transform(app, data, value)

    // Set value back to field.
    data = setByPathSegments(data, this._fieldPath, value)

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
