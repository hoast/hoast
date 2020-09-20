// Import internal modules.
import iterate from './iterate.js'

const call = async function (options, context, methodName, ...methodArguments) {
  if (Array.isArray(context)) {
    if (context.length === 0) {
      return
    }

    await iterate({
      exhausted: false,
      next: async function (index) {
        const contextItem = context[index]
        if (typeof (contextItem) === 'object' && typeof (contextItem[methodName]) === 'function') {
          await contextItem[methodName](...methodArguments)
        }

        if (index + 1 >= context.length) {
          this.exhausted = true
        }
      },
    }, options.concurrencyLimit)
    return
  }

  if (typeof (context) === 'object' && typeof (context[methodName]) === 'function') {
    await context[methodName](...methodArguments)
  }
}

export default call
