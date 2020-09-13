export const callSync = function (context, methodName, ...methodArguments) {
  if (Array.isArray(context)) {
    for (const item of context) {
      callSync(item, methodName, ...methodArguments)
    }
    return
  }

  if (typeof (context) === 'object' && typeof (context[methodName]) === 'function') {
    context[methodName](...methodArguments)
  }
}

export const call = async function (context, methodName, ...methodArguments) {
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
  callSync,
  call,
}
