// Import base class.
import BaseProcess from '@hoast/base-process'

// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import instantiate from '@hoast/utils/instantiate.js'
import { setByPathSegments } from '@hoast/utils/set.js'

class ProcessParse extends BaseProcess {
  constructor(options) {
    super({
      property: 'contents',

      parser: JSON.parse,
    }, options)

    // Convert dot notation to path segments.
    this._propertyPath = this._options.property.split('.')
  }

  async initialize () {
    this._parser = await instantiate(this._options.parser)
  }

  concurrent (data) {
    // Get value.
    let value = getByPathSegments(data, this._propertyPath)
    // Parse value.
    value = this._parser(value)
    // Set value.
    data = setByPathSegments(data, this._propertyPath, value)
    // Return result.
    return data
  }
}

export default ProcessParse
