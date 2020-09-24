// Import base class.
import BaseProcessor from '@hoast/base-processor'

// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

class ProcessParse extends BaseProcessor {
  constructor(options) {
    super({
      property: 'contents',

      parser: JSON.parse,
    }, options)

    // Convert dot notation to path segments.
    this._propertyPath = this._options.property.split('.')
  }

  concurrent (data) {
    // Get value.
    let value = getByPathSegments(data, this._propertyPath)
    // Parse value.
    value = this._options.parse(value)
    // Set value.
    data = setByPathSegments(data, this._propertyPath, value)
    // Return result.
    return data
  }
}

export default ProcessParse
