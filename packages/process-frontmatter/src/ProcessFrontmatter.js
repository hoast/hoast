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
      fence: '---',
    }, options)

    // Convert dot notation to path segments.
    this._propertyPath = this._options.property.split('.')
    this._frontmatterPropertyPath = this._options.frontmatterProperty.split('.')
  }

  concurrent (data) {
    // Get value.
    const value = getByPathSegments(data, this._propertyPath)
    // Split frontmatter from the rest.
    let [frontmatter, rest] = value.split(this._options.fence, 1)

    // TODO: Fix frontmatter extraction.
    // Search for split fence.
    // If first line of file is fence then skip this line and continue else exit early.
    // Trim whitespace check if fence is the full line, if not skip.
    // If it matches the fence then substring up until then and remove the fences on either end.

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
