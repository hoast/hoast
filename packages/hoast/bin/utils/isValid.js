import { hasKeys } from '@hoast/utils/has.js'
import { isObject } from '@hoast/utils/is.js'

export const isValidConfig = function (value) {
  if (!hasKeys(value, ['collections'])) {
    return {
      error: 'Object does not contain "collections" property.',
    }
  }

  if (Object.prototype.hasOwnProperty.call(value, 'processes') && !isObject(value.processes)) {
    return {
      error: 'Invalid type for "processes" property, must be of type "object".',
    }
  }

  return true
}

export default {
  isValidConfig,
}
