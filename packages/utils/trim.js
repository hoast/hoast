export const trimStart = function (string, character) {
  if (character === ']') {
    character = '\\]'
  } else if (character === '\\') {
    character = '\\\\'
  }

  return string.replace(new RegExp('^[' + character + ']', 'g'), '')
}

export const trim = function (string, character) {
  if (character === ']') {
    character = '\\]'
  } else if (character === '\\') {
    character = '\\\\'
  }

  return string.replace(new RegExp('^[' + character + ']+|[' + character + ']+$', 'g'), '')
}

export const trimEnd = function (string, character) {
  if (character === ']') {
    character = '\\]'
  } else if (character === '\\') {
    character = '\\\\'
  }

  return string.replace(new RegExp('[' + character + ']$', 'g'), '')
}

export default {
  trimStart,
  trim,
  trimEnd,
}
