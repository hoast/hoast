// Import internal modules.
import iterate from './iterate.js'

const call = async function (options, context, functionName, ...functionArguments) {
  if (Array.isArray(context)) {
    if (context.length === 0) {
      return
    }

    await iterate({
      exhausted: false,
      next: async function (index) {
        const contextItem = context[index]
        if (typeof (contextItem) === 'object' && typeof (contextItem[functionName]) === 'function') {
          await contextItem[functionName](...functionArguments)
        }

        if (index + 1 >= context.length) {
          this.exhausted = true
        }
      },
    }, options.concurrencyLimit)
    return
  }

  if (typeof (context) === 'object' && typeof (context[functionName]) === 'function') {
    await context[functionName](...functionArguments)
  }
}

export default call
