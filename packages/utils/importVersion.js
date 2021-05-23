export default async (filePath, version = 0) => {
  // Append version to file path.
  if (version && version > 0) {
    filePath += '?version=' + version
  }

  return await import(filePath)
}
