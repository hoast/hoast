export default async (
  filePath,
  version = 0,
  namespace = null,
) => {
  if (
    version && (
      typeof (version) === 'number'
        ? version > 0
        : true
    )
  ) {
    filePath += '?version=' + version
  }

  if (namespace) {
    filePath += '?namespace=' + namespace
  }

  return await import(filePath)
}
