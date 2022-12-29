import { URL } from 'url'

export const resolve = async function (specifier, context, defaultResolve) {
  const resolved = await defaultResolve(specifier, context, defaultResolve)
  const resolvedURL = new URL(resolved.url)

  // Ignore node modules.
  if (resolvedURL.protocol === 'nodejs:' || resolvedURL.protocol === 'node:' || resolvedURL.pathname.includes('/node_modules/')) {
    return resolved
  }

  if (!resolvedURL.searchParams.has('version') && context.parentURL) {
    // Get query paramter from parent if set.
    const parentURL = new URL(context.parentURL)
    if (parentURL.searchParams.has('version')) {
      resolvedURL.searchParams.set('version', parentURL.searchParams.get('version'))
    }
  }

  // Return filepath with optional query parameter.
  return {
    url: resolvedURL.protocol + '//' + resolvedURL.pathname + '?' + resolvedURL.searchParams.toString(),
  }
}
