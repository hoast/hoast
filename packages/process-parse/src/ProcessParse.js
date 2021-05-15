// Import base class.
import BaseProcess from '@hoast/base-process'

// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import instantiate from '@hoast/utils/instantiate.js'
import { setByPathSegments } from '@hoast/utils/set.js'

class ProcessParse extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      property: 'contents',
      parser: JSON.parse,
    }, options)
    options = this.getOptions()

    // Convert dot notation to path segments.
    this._propertyPath = options.property.split('.')
  }

  async initialize () {
    const options = this.getOptions()

    if (Array.isArray(options.parser) || typeof (options.parser) === 'string') {
      this._parser = await instantiate(options.parser)
    } else {
      this._parser = options.parser
    }
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

  final () {
    super.final()

    this._parser = null
  }
}

export default ProcessParse
