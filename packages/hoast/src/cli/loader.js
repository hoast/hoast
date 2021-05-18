import { URL } from 'url'

export async function resolve (specifier, context, defaultResolve) {
  const result = defaultResolve(specifier, context, defaultResolve)
  const resultUrl = new URL(result.url)

  // Ignore node modules.
  if (resultUrl.protocol === 'nodejs:' || resultUrl.protocol === 'node:' || resultUrl.pathname.includes('/node_modules/')) {
    return result
  }

  // Append current time as a query to the file path.
  return {
    url: resultUrl.href + '?t=' + (Date.now()),
  }
}
