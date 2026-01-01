// Import utils.
import { anyToString } from './StringUtils.js'

// Incomplete list of self closing tags.
const SELF_CLOSING_TAGS = [
  'br',
  'hr',
  'img',
  'input',
  'meta',
  'meta',
  'wbr',
]

export const render = function (tag, attributes, ...children) {
  // Start element.
  let element = '<' + tag

  // Add attributes.
  if (typeof (attributes) === 'object' && !Array.isArray(attributes)) {
    for (const name in attributes) {
      let value = attributes[name]
      if (typeof (value) !== 'string') {
        value = anyToString(value, true)
      }
      element += ' ' + name + '="' + value + '"'
    }
  } else {
    // If no attributes provided assume it to be children.
    children.unshift(attributes)
  }

  // Return early if self closing.
  if (SELF_CLOSING_TAGS.includes(tag)) {
    // Close opening tag.
    element += '/>'
    // Return element.
    return element
  }

  // Close opening tag.
  element += '>'

  // Flatten array.
  children = children.flat(4)

  // Add child to element's inside.
  children.forEach((child) => {
    element += child
  })

  // Add closing tag.
  element += '</' + tag + '>'

  // Return element.
  return element
}

export default {
  render,
}
