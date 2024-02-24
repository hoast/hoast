// Import base class.
import BaseProcess from '@hoast/base-process'

// Import utility modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

// Import external unified modules.
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

const EXTENSIONS_FROM = ['md', 'markdown']
const EXTENSIONS_TO = 'html'

class ProcessMarkdown extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      property: 'contents',

      remarkPlugins: [],
      remarkParseOptions: {},
      remarkRehypeOptions: {},
      rehypeRawOptions: {},

      rehypePlugins: [],
      rehypeSanitizeOptions: {},
      rehypeStringifyOptions: {},
    }, options)
    options = this.getOptions()

    // Convert dot notation to path segments.
    this._propertyPath = options.property.split('.')
  }

  async initialize () {
    const options = this.getOptions()

    if (!this._parser) {
      // Construct unified parser.
      this._parser = unified()

      const addPlugin = async (plugin) => {
        let result, parameters
        if (Array.isArray(plugin)) {
          result = plugin.shift()
          parameters = plugin
        } else {
          result = plugin
          parameters = []
        }

        // Get type of result.
        let type = typeof (result)

        // Import as package if string.
        if (type === 'string') {
          result = (await import(result))
          if (result.default) {
            result = result.default
          }

          // Get type of imported.
          type = typeof (result)

          // Check new value.
          if (type !== 'function') {
            throw new Error('Imported type must be a class or function.')
          }
        }

        this._parser
          .use(result, ...parameters)
      }

      this._parser
        .use(remarkParse, options.remarkParseOptions) // Markdown to Markdown AST.

      // Add remark plugins.
      for (const plugin of options.remarkPlugins) {
        await addPlugin(plugin)
      }

      this._parser
        .use(remarkRehype, options.remarkRehypeOptions) // Markdown AST to HTML AST.
        .use(rehypeRaw, options.rehypeRawOptions) // Reparse HTML AST.
        .use(rehypeSanitize, options.rehypeSanitizeOptions) // Sanitize HTML AST.

      // Add rehype plugins.
      for (const plugin of options.rehypePlugins) {
        await addPlugin(plugin)
      }

      this._parser
        .use(rehypeStringify, options.rehypeStringifyOptions) // HTML AST to string.
    }
  }

  async concurrent (data) {
    // Get value from data.
    let value = getByPathSegments(data, this._propertyPath)

    // Parse data.
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        value[i] = (await this._parser.process(value[i])).value
      }
    } else {
      value = (await this._parser.process(value)).value
    }

    // Set value back to data.
    data = setByPathSegments(data, this._propertyPath, value)

    // Change extension.
    if (data.path) {
      // Split path into segments.
      const pathSegments = data.path.split('.')
      // Check if file ends with an expected extension.
      if (EXTENSIONS_FROM.indexOf(pathSegments[pathSegments.length - 1]) >= 0) {
        // Remove existing extension.
        pathSegments.pop()
        // Add html extension.
        pathSegments.push(EXTENSIONS_TO)
        // Write path back to data.
        data.path = pathSegments.join('.')
      }
    }

    // Return result.
    return data
  }
}

export default ProcessMarkdown
