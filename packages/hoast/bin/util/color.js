// Node modules.
import util from 'util'

/*
  'reset',           'bold',          'dim',
  'italic',          'underline',     'blink',
  'inverse',         'hidden',        'strikethrough',
  'doubleunderline', 'black',         'red',
  'green',           'yellow',        'blue',
  'magenta',         'cyan',          'white',
  'bgBlack',         'bgRed',         'bgGreen',
  'bgYellow',        'bgBlue',        'bgMagenta',
  'bgCyan',          'bgWhite',       'framed',
  'overlined',       'gray',          'redBright',
  'greenBright',     'yellowBright',  'blueBright',
  'magentaBright',   'cyanBright',    'whiteBright',
  'bgGray',          'bgRedBright',   'bgGreenBright',
  'bgYellowBright',  'bgBlueBright',  'bgMagentaBright',
  'bgCyanBright',    'bgWhiteBright'
 */

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
