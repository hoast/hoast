// Node modules.
const path = require('path')
// Dependency modules.
const test = require('ava')
// Library modules.
const Hoast = require('../../../library')
const parsePatterns = require('../../../node_modules/planckmatch/parse')
const scanDirectory = require('../../../library/helpers/scanDirectory')

test('type check', function(t) {
  const hoast = Hoast(__dirname)

  t.is(typeof (Hoast.helpers.scanDirectory), 'function')
  t.is(typeof (hoast.helpers.scanDirectory), 'function')
  t.is(Hoast.helpers.scanDirectory, hoast.helpers.scanDirectory)
})

test('type check legacy', function(t) {
  const hoast = Hoast(__dirname)

  t.is(typeof (Hoast.helper.scanDirectory), 'function')
  t.is(typeof (hoast.helper.scanDirectory), 'function')
  t.is(Hoast.helper.scanDirectory, hoast.helper.scanDirectory)
  t.is(Hoast.helper.scanDirectory, Hoast.helpers.scanDirectory)
})

test('scan directory', async function(t) {
  // Create file path.
  const pathSrc = path.join(__dirname, 'source')
  const patterns = parsePatterns(['directory', '*/*.txt'], { globstar: true }, true)

  try {
    // Scan directory.
    let files = await scanDirectory(
      pathSrc,
      // Parse patterns.
      patterns,
      // Any pattern needs to match.
      false
    )

    files = files.map(function(file) {
      // Check file data.
      t.true(Object.prototype.hasOwnProperty.call(file, 'path'))
      t.true(Object.prototype.hasOwnProperty.call(file, 'stats'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'dev'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'ino'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'mode'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'nlink'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'uid'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'gid'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'rdev'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'size'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'atimeMs'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'mtimeMs'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'ctimeMs'))
      t.true(Object.prototype.hasOwnProperty.call(file.stats, 'birthtimeMs'))

      // Remove properties only leave path.
      return file.path
    })

    // Compare found files.
    t.deepEqual(files, [
      `directory${path.sep}file.txt`,
    ])
  } catch (error) {
    t.fail(error)
  }
})
