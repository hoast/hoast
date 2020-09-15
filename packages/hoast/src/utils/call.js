// TODO: Add concurrency to asynchronous calls.

export const call = async function (options, context, methodName, ...methodArguments) {
  if (Array.isArray(context)) {
    for (const item of context) {
      await call(item, methodName, ...methodArguments)
    }
    return
  }

  if (typeof (context) === 'object' && typeof (context[methodName]) === 'function') {
    await context[methodName](...methodArguments)
  }
}

export default {
  call,
}
