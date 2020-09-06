// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const fsOpenDir = promisify(fs.opendir)

const createIterator = async function (directory) { // TODO: Fix.
  console.log('createIterator', directory)

  // Sub iterator for recursive calls.
  let subIterator

  // Open directory.
  const resource = await fsOpenDir(directory, { encoding: 'utf8' })

  return async function () {
    // If sub iterator exists try and get item from that first.
    if (subIterator) {
      const item = await subIterator()
      if (item) {
        return item
      }

      subIterator = null
    }

    let item
    // Get directory item.
    while (item = await resource.read()) {
      // For directories recursively create an iterator on the sub directory.
      if (item.isDirectory()) {
        subIterator = await createIterator(
          path.resolve(directory, item.name)
        )

        item = await subIterator()

        if (!item) {
          subIterator = null
          continue
        }
      }

      // Construct file path.
      const filePath = path.resolve(directory, item.name)
      return filePath
    }

    // Close directory resource handler.
    console.log('close')
    await resource.close()
  }
}

export default createIterator