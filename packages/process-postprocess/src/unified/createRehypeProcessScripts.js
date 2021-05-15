import fromString from 'hast-util-from-string'
import hasProperty from 'hast-util-has-property'
import isScript from 'hast-util-is-javascript'
import toString from 'hast-util-to-string'
import visit from 'unist-util-visit'

export default function (processor) {
  return async function (tree) {
    const nodes = []

    // Get all script nodes.
    visit(tree, 'element', (node) => {
      if (isScript(node) && !hasProperty(node, 'src')) {
        nodes.push(node)
      }
    })

    // Process all script nodes.
    await Promise.all(
      nodes.map(async (node) => {
        fromString(node, await processor(toString(node)))
      })
    )

    return tree
  }
}
