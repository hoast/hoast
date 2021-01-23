const SELFCLOSING = ['br', 'hr', 'input', 'meta']

function flatDeep (arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), []) : arr.slice();
};

export default function (tag, attributes, ...children) {
  // Start element.
  let element = '<' + tag

  // Add attributes.
  if (typeof (attributes) === 'object' && !Array.isArray(attributes)) {
    for (const key in attributes) {
      let value = attributes[key]

      // Convert arrays into strings.
      if (Array.isArray(value)) {
        value = value.reduce((sum, part) => {
          if (typeof part === 'string') {
            sum += ' ' + part
          }
          return sum
        }, '')
      } else if (typeof (value) !== 'string') {
        // Skip if not a string.
        continue
      }

      // Add attribute to tag.
      element += ' ' + key + '="' + value + '"'
    }
  } else {
    // If no attributes provided assume it to be children.
    children.unshift(attributes)
  }

  // Return early if self closing.
  if (SELFCLOSING.indexOf(tag) >= 0) {
    // Close opening tag.
    element += '/>'
    // Return element.
    return element
  }

  // Close opening tag.
  element += '>'

  // Flatten array.
  children = flatDeep(children, Number.MAX_SAFE_INTEGER)

  // Add child to element's inside.
  children.forEach((child) => {
    element += child
  })

  // Add closing tag.
  element += '</' + tag + '>'

  // Return element.
  return element
}
