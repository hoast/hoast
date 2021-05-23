// Import highlight.js.
import hljs from 'highlight.js/lib/core.js'
import hljsXml from 'highlight.js/lib/languages/xml.js'
import hljsJavascript from 'highlight.js/lib/languages/javascript.js'

// Import renderer.
import { render as r } from '../utils/RenderUtils.js'

const { highlight } = hljs
hljs.registerLanguage('xml', hljsXml)
hljs.registerLanguage('javascript', hljsJavascript)

export default function (options, ...contents) {
  // Override default options.
  options = Object.assign({
    language: 'xml',
  }, options)
  options.language = options.language.toLowerCase()
  if (options.language === 'html') {
    options.language = 'xml'
  } else if (options.language === 'js') {
    options.language = 'javascript'
  }

  // prepare contents.
  contents = contents.flat(4)
  contents = contents.join('\n')

  return r('pre',
    r('code', {
      class: '-text-2 sm:-text-1',
    }, [
      highlight(contents, { language: options.language }).value,
    ])
  )
}
