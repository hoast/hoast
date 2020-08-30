import { hasKeys } from '../../src/util/has.js';
import { isObject } from '../../src/util/is.js';

export const isValidConfig = function (value) {
  if (!hasKeys(value, ['collections'])) {
    return {
      error: 'Object does not contain "collections" property.'
    }
  }

  if (Object.prototype.hasOwnProperty.call(value, 'processes') && !isObject(value.processes)) {
    return {
      error: 'Invalid type for "processes" property, must be of type "object".'
    }
  }

  // TODO:
}

export default {
  isValidConfig,
}
