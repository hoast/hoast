export const call = function (context, methodName, ...methodArguments) {
  if (Array.isArray(context)) {
    for (const item of context) {
      call(item, methodName, ...methodArguments)
    }
    return
  }

  if (typeof (context) === 'object' && typeof (context[methodName]) === 'function') {
    context[methodName](...methodArguments)
  }
}

export const callAsync = async function (context, methodName, ...methodArguments) {
  if (Array.isArray(context)) {
    for (const item of context) {
      await callAsync(item, methodName, ...methodArguments)
    }
    return
  }

  if (typeof (context) === 'object' && typeof (context[methodName]) === 'function') {
    await context[methodName](...methodArguments)
  }
}

export default {
  call,
  callAsync,
}
