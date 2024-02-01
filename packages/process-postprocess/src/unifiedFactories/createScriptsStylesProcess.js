import { fromString } from 'hast-util-from-string'
import { hasProperty } from 'hast-util-has-property'
import { isJavaScript } from 'hast-util-is-javascript'
import { toString } from 'hast-util-to-string'
import { isCssStyle } from 'hast-util-is-css-style'
import { visit } from 'unist-util-visit'

export default function (stylesProcessor, scriptsProcessor) {
  return async function (tree) {
    const inlineStyleNodes = [], styleNodes = [], scriptNodes = []

    // Get all script nodes.
    visit(tree, 'element', (node) => {
      if (isCssStyle(node)) {
        styleNodes.push(node)
      } else if (isJavaScript(node) && !hasProperty(node, 'src')) {
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
          value = await stylesProcessor('*{' + value + '}')
          node.properties.style = value ? value.substring(2, value.length - 1) : null
        }
      }),
      styleNodes.map(async (node) => {
        fromString(node, await stylesProcessor(toString(node)))
      }),
      scriptNodes.map(async (node) => {
        fromString(node, await scriptsProcessor(toString(node)))
      }),
    )

    return tree
  }
}
