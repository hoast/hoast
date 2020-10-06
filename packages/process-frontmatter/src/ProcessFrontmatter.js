// Import base class.
import BaseProcess from '@hoast/base-process'

// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

const NEW_LINE = '\n'

class ProcessFrontmatter extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      property: 'contents',
      frontmatterProperty: 'frontmatter',

      fence: '---',
      parser: JSON.parse,
    }, options)

    // Convert dot notation to path segments.
    this._fence = this._options.fence.toLowerCase()
    this._propertyPath = this._options.property.split('.')
    this._frontmatterPropertyPath = this._options.frontmatterProperty.split('.')
  }

  concurrent (data) {
    // Get value.
    const value = getByPathSegments(data, this._propertyPath)

    // Check if file starts with the fence.
    let startIndex = value.indexOf(NEW_LINE)
    if (startIndex < 0) {
      // No content.
      return data
    }
    if (value.substring(0, startIndex).trim().toLowerCase() !== this._fence) {
      // Does not start with fence.
      return data
    }

    // Skip past new line character.
    startIndex++

    let temp
    let lineIndexSum = startIndex
    let lineStartIndex
    let lineEndIndex
    while (true) {
      temp = value.substring(lineIndexSum)
      lineStartIndex = temp.indexOf(this._fence)
      if (!lineStartIndex) {
        // No frontmatter end fence.
        return data
      }
      // Get index after new line character before the fence.
      temp = temp.substring(0, lineStartIndex)
      lineStartIndex = temp.lastIndexOf(NEW_LINE)
      if (!lineStartIndex) {
        lineStartIndex = 0
      } else {
        lineStartIndex++
      }

      lineIndexSum += lineStartIndex

      // Get index before new line character after the fence.
      temp = value.substring(lineIndexSum)
      lineEndIndex = temp.indexOf(NEW_LINE)
      if (!lineEndIndex) {
        lineEndIndex = temp.length - 1
      }

      temp = temp.substring(0, lineEndIndex)

      // Check if line is only the fence.
      if (temp.trim().toLowerCase() === this._fence) {
        break
      }

      lineIndexSum += lineEndIndex
    }

    // Get frontmatter.
    let frontmatter = value.substring(startIndex, lineIndexSum)
    // Get rest.
    const rest = value.substring(lineIndexSum + lineEndIndex)

    // Parse frontmatter.
    if (this._options.parser) {
      frontmatter = this._options.parser(frontmatter)
    }
    // Set values.
    data = setByPathSegments(data, this._frontmatterPropertyPath, frontmatter)
    data = setByPathSegments(data, this._propertyPath, rest)
    // Return result.
    return data
  }
}

export default ProcessFrontmatter
