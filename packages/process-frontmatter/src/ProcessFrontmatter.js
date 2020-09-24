// Import base class.
import BaseProcessor from '@hoast/base-processor'

// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

class ProcessFrontmatter extends BaseProcessor {
  constructor(options) {
    super({
      property: 'contents',
      frontmatterProperty: 'frontmatter',

      parser: JSON.parse,
      split: '---',
    }, options)

    // Convert dot notation to path segments.
    this._propertyPath = this._options.property.split('.')
    this._frontmatterPropertyPath = this._options.frontmatterProperty.split('.')
  }

  concurrent (data) {
    // Get value.
    const value = getByPathSegments(data, this._propertyPath)
    // Split frontmatter from the rest.
    let [frontmatter, rest] = value.split(this._options.split, 1)
    // Parse frontmatter.
    frontmatter = this._options.parse(frontmatter)
    // Set values.
    data = setByPathSegments(data, this._frontmatterPropertyPath, frontmatter)
    data = setByPathSegments(data, this._propertyPath, rest)
    // Return result.
    return data
  }
}

export default ProcessFrontmatter
