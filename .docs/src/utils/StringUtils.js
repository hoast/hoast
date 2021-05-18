// Import minifier.
import babel from '@babel/core'

const BABEL_OPTIONS = {
  comments: false,
  compact: true,
  retainLines: false,
}

export const anyToString = function (data, asCode = false, unwrap = true) {
  switch (typeof (data)) {
    default:
      if (asCode) {
        if (data === null) {
          return 'null'
        }
        return 'undefined'
      }

      return ''

    case 'boolean':
      return data ? 'true' : 'false'

    case 'function':
      // Convert function into text.
      data = '' + data

      // Skip if it is a class.
      if (unwrap && data.startsWith('class')) {
        return
      }

      // Remove wrapper code.
      if (unwrap) {
        // Remove all until first closing parenthesis.
        // function ({a, b}) { return a + b }
        //                 ^
        const indexStart = data.indexOf(')') + 1
        data = data.substring(indexStart)
        // Remove all outside of curly brackets.
        // function ({a, b}) { return a + b }
        //                   ^              ^
        data = data.substring(data.indexOf('{') + 1, data.lastIndexOf('}'))
        // Process code so it fits on a single line.
        data = babel.transformSync(data, BABEL_OPTIONS).code
      }

      return data

    case 'number':
      return '' + data

    case 'object':
      if (Array.isArray(data)) {
        data = data
          .map((value) => {
            return anyToString(value, true, false) ?? 'null'
          })
          .join(asCode ? ',' : ' ')

        if (asCode) {
          data = '[' + data + ']'
        }

        return data
      }

      let result = []
      for (const key in data) {
        if (!Object.prototype.hasOwnProperty.call(data, key)) {
          continue
        }

        let value = anyToString(data[key], true, !asCode) ?? 'null'

        if (asCode) {
          value = key + ':' + value
        } else {
          value = key + '="' + value + '"'
        }

        result.push(value)
      }
      result = result.join(asCode ? ',' : ' ')

      if (asCode) {
        result = '{' + result + '}'
      }

      return result

    case 'string':
      if (asCode) {
        data = '\'' + data + '\''
      }

      return data
  }
}

export const escapeHtmlCharacters = function (string) {
  return string.replace(/[\u00A0-\u9999<>&]/g, function (character) {
    return '&#' + character.charCodeAt(0) + ';'
  })
}

export default {
  anyToString: anyToString,
  escapeHtmlCharacters: escapeHtmlCharacters,
}
