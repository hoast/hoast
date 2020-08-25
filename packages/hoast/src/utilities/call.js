export const call = function(context, methodName, ...methodArguments) {
  if (Array.isArray(context)) {
    for (const item in context) {
      callAsync(item, methodName, ...methodArguments)
    }
    return
  }

  if (typeof (context) === 'object' && Object.prototype.hasOwnProperty.call(context, methodName)) {
    context[methodName](...methodArguments)
  }
}

export const callAsync = async function(context, methodName, ...methodArguments) {
  if (Array.isArray(context)) {
    for (const item in context) {
      await callAsync(item, methodName, ...methodArguments)
    }
    return
  }

  if (typeof (context) === 'object' && Object.prototype.hasOwnProperty.call(context, methodName)) {
    await context[methodName](...methodArguments)
  }
}

export default {
  call,
  callAsync,
}
