// Node modules.
const fs = require('fs')
const path = require('path')
// Dependency modules.
const test = require('ava')
// Helper modules.
const constructTree = require('../../helpers/constructTree')
const copyDirectory = require('../../helpers/copyDirectory')
// Library modules.
const Hoast = require('../../../library')
const removeFiles = require('../../../library/helpers/removeFiles')

test('type check', function(t) {
  const hoast = Hoast(__dirname)

  t.is(typeof (Hoast.helpers.removeFiles), 'function')
  t.is(typeof (hoast.helpers.removeFiles), 'function')
  t.is(Hoast.helpers.removeFiles, hoast.helpers.removeFiles)
})

test('type check legacy', function(t) {
  const hoast = Hoast(__dirname)

  t.is(typeof (Hoast.helper.remove), 'function')
  t.is(typeof (hoast.helper.remove), 'function')
  t.is(Hoast.helper.remove, hoast.helper.remove)
  t.is(Hoast.helper.remove, Hoast.helpers.removeFiles)
})

test('remove directory', async function(t) {
  t.plan(2)

  // Create file path.
  const pathDst = __filename.substring(0, __filename.indexOf('.'))
  const pathSrc = path.join(__dirname, 'source')

  try {
    // Copy directory.
    await copyDirectory(pathSrc, pathDst)
    // Check directory exists.
    t.deepEqual(await constructTree(pathDst), {
      files: [
        {
          files: [
            'file.txt',
          ],
          path: 'directory',
        },
        'file.txt',
        'other.md',
      ],
      path: '',
    })
    // Remove directory.
    await removeFiles(pathDst)
    // Check directory exists.
    await new Promise(function(resolve) {
      fs.lstat(pathDst, function(error) {
        t.true(error.code === 'ENOENT')
        resolve()
      })
    })
  } catch (error) {
    t.fail(error)
  }
})
