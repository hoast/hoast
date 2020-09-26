// Import base class.
import BaseProcess from '@hoast/base-process'

// Import utility modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

// Import external unified modules.
import unified from 'unified'
import remarkParse from 'remark-parse'
import remarkExternalLinks from 'remark-external-links'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

class ProcessMarkdown extends BaseProcess {
  constructor(options) {
    super({
      property: 'contents',

      changeExtension: [
        'md',
      ],
      highlightOptions: false,
    }, options)

    // Convert dot notation to path segments.
    this._propertyPath = this._options.property.split('.')
  }

  initialize () {
    // Construct unified parser.
    this._parser = unified()
      .use(remarkParse) // Markdown to Mardown AST.
      .use(remarkExternalLinks) // Safely link to external sources.
      .use(remarkRehype) // Markdown AST to HTML AST.
      .use(rehypeRaw) // Reparse HTML AST.

    // Add highlighting to code blocks.
    if (this._options.highlightOptions) {
      this._parser
        .use(rehypeHighlight, this._options.highlightOptions) // Code highlighting.
    }

    this._parser
      .use(rehypeSanitize) // Sanitize HTML AST.
      .use(rehypeStringify) // HTML AST to string.
  }

  async concurrent (data) {
    // Get value from data.
    let value = getByPathSegments(data, this._propertyPath)

    // Parse data.
    value = await this._parser.process(value)
    value = value.contents

    // Set value back to data.
    data = setByPathSegments(data, this._propertyPath, value)

    // Change extension.
    if (this._options.changeExtension && data.path) {
      // Split path into segments.
      const pathSegments = data.path.split('.')
      // Check if file ends with an expected extension.
      if (this._options.changeExtension.indexOf(pathSegments[pathSegments.length - 1]) >= 0) {
        // Remove existin extension.
        pathSegments.pop()
        // Add html extension.
        pathSegments.push('html')
        // Write path back to data.
        data.path = pathSegments.join('.')
      }
    }

    // Return result.
    return data
  }
}

export default ProcessMarkdown
