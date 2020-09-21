/**
 * Executes string as code.
 * @param code
 * @param contextName
 * @param context
 */
export default function (code, context, contextName = 'context') {
  return Function('"use strict"; return (function(' + contextName + ') { ' + code + ' });')()(context) // eslint-disable-line no-new-func
}
