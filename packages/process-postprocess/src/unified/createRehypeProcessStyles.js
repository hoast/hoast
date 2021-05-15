import fromString from 'hast-util-from-string'
import isStyle from 'hast-util-is-css-style'
import toString from 'hast-util-to-string'
import visit from 'unist-util-visit'

export default function (processor) {
  return async function (tree) {
    const nodes = []

    visit(tree, 'element', function (node) {
      if (isStyle(node)) {
        nodes.push(node)
      }
    })

    await Promise.all(
      nodes.map(async (node) => {
        fromString(node, processor(toString(node)))
      })
    )

    return tree
  }
}
