// Node modules.
import util from 'util'

/**
 * Colorize text.
 * @param {String} color Name of color to apply.
 * @param {String} text Text to color.
 */
const colorize = function (color, text) {
  const codes = util.inspect.colors[color]
  return '\x1b[' + codes[0] + 'm' + String.prototype.toString.call(text) + '\x1b[' + codes[1] + 'm'
}

/**
 * Dynamically generate color methods based of name.
 */
const colors = function () {
  let result = {}
  Object.keys(util.inspect.colors).forEach((color) => {
    result[color] = (text) => colorize(color, text)
  })
  return result
}

export default colors()
