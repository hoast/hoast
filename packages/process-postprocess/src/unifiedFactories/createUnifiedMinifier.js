// Import unified and rehype processes.
import unified from 'unified'
import rehypeMinifyAttributeWhitespace from 'rehype-minify-attribute-whitespace'
import rehypeMinifyEnumeratedAttribute from 'rehype-minify-enumerated-attribute'
import rehypeMinifyEventHandler from 'rehype-minify-event-handler'
import rehypeMinifyJavascriptUrl from 'rehype-minify-javascript-url'
import rehypeMinifyJsonScript from 'rehype-minify-json-script'
import rehypeMinifyLanguage from 'rehype-minify-language'
import rehypeMinifyMediaAttribute from 'rehype-minify-media-attribute'
import rehypeMinifyMetaColor from 'rehype-minify-meta-color'
import rehypeMinifyMetaContent from 'rehype-minify-meta-content'
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import rehypeNormalizeAttributeValueCase from 'rehype-normalize-attribute-value-case'
import rehypeParse from 'rehype-parse'
import rehypeRemoveComments from 'rehype-remove-comments'
import rehypeRemoveDuplicateAttributeValues from 'rehype-remove-duplicate-attribute-values'
import rehypeRemoveEmptyAttribute from 'rehype-remove-empty-attribute'
import rehypeRemoveExternalScriptContent from 'rehype-remove-external-script-content'
import rehypeRemoveMetaHttpEquiv from 'rehype-remove-meta-http-equiv'
import rehypeRemoveScriptTypeJavascript from 'rehype-remove-script-type-javascript'
import rehypeRemoveStyleTypeCss from 'rehype-remove-style-type-css'
import rehypeSortAttributeValues from 'rehype-sort-attribute-values'
import rehypeSortAttributes from 'rehype-sort-attributes'
import rehypeStringify from 'rehype-stringify'

// Import custom rehype processes.
import createScriptsStylesProcess from './createScriptsStylesProcess.js'

export default function (options, plugins, stylesProcessor, scriptsProcessor) {
  options = Object.assign({
    minify: true,
  }, options)

  // Setup unified.
  const parser = unified()

  // Parse string.
  parser.use(rehypeParse)
  // Custom parser for scripts and styles.
  parser.use(createScriptsStylesProcess, stylesProcessor, scriptsProcessor)

  // Add additional given plugins.
  if (plugins) {
    for (const plugin of plugins) {
      parser.use(plugin)
    }
  }

  // Add minify plugins.
  if (options.minify) {
    parser
      .use(rehypeMinifyAttributeWhitespace)
      .use(rehypeMinifyEnumeratedAttribute)
      .use(rehypeMinifyEventHandler)
      .use(rehypeMinifyJavascriptUrl)
      .use(rehypeMinifyJsonScript)
      .use(rehypeMinifyLanguage)
      .use(rehypeMinifyMediaAttribute)
      .use(rehypeMinifyMetaColor)
      .use(rehypeMinifyMetaContent)
      .use(rehypeMinifyWhitespace)
      .use(rehypeNormalizeAttributeValueCase)
      .use(rehypeRemoveComments)
      .use(rehypeRemoveDuplicateAttributeValues)
      .use(rehypeRemoveEmptyAttribute)
      .use(rehypeRemoveExternalScriptContent)
      .use(rehypeRemoveMetaHttpEquiv)
      .use(rehypeRemoveScriptTypeJavascript)
      .use(rehypeRemoveStyleTypeCss)
      .use(rehypeSortAttributeValues)
      .use(rehypeSortAttributes)
  }

  // Stringify tree.
  parser.use(rehypeStringify)

  return parser
}
