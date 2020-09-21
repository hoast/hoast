// Import external modules.
import BaseProcessor from '@hoast/base-processor'
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

/* How to: only process if file has markdown or md extension.
 * {
 *   filterProperty: 'extensions',
 *   filterPatterns: [
 *     'md',
 *     'markdown',
 *   ],
 * },
 */

class ProcessMarkdown extends BaseProcessor {
  constructor(options) {
    super({
      property: 'contents',

      highlighting: false,
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
    if (this._options.highlighting) {
      this._parser
        .use(rehypeHighlight) // Code highlighting.
    }

    this._parser
      .use(rehypeSanitize) // Sanitize HTML AST.
      .use(rehypeStringify) // HTML AST to string.
  }

  async concurrent (data) {
    let result = getByPathSegments(data, this._propertyPath)
    result = await this._parser.process(result)
    data = setByPathSegments(data, this._propertyPath, result.contents)
    return data
  }
}

export default ProcessMarkdown
