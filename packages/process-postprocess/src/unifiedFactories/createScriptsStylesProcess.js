import fromString from 'hast-util-from-string'
import { hasProperty } from 'hast-util-has-property'
import isScript from 'hast-util-is-javascript'
import toString from 'hast-util-to-string'
import isStyle from 'hast-util-is-css-style'
import { visit } from 'unist-util-visit'

const INLINE_STYLE_PREFIX = '*{'
const INLINE_STYLE_SUFFIX = '}'

export default function (stylesProcessor, scriptsProcessor) {
  return async function (tree) {
    const inlineStyleNodes = [], styleNodes = [], scriptNodes = []

    // Get all script nodes.
    visit(tree, 'element', (node) => {
      if (isStyle(node)) {
        styleNodes.push(node)
      } else if (isScript(node) && !hasProperty(node, 'src')) {
        scriptNodes.push(node)
      } else if (hasProperty(node, 'style')) {
        inlineStyleNodes.push(node)
      }
    })

    // Process all script nodes.
    await Promise.all(
      inlineStyleNodes.map(async (node) => {
        let value = node.properties.style
        if (typeof value === 'string') {
          value = await stylesProcessor(INLINE_STYLE_PREFIX + value + INLINE_STYLE_SUFFIX)
          node.properties.style = value ? value.substring(INLINE_STYLE_PREFIX.length, -INLINE_STYLE_SUFFIX.length) : null
        }
      }),
      styleNodes.map(async (node) => {
        fromString(node, await stylesProcessor(toString(node)))
      }),
      scriptNodes.map(async (node) => {
        fromString(node, await scriptsProcessor(toString(node)))
      })
    )

    return tree
  }
}
