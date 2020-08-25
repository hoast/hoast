// Dependency modules.
const test = require('ava')
// Custom module.
const read = require('../../library/read')

// Build-in modules.
test('modules', function(t) {
  t.is(typeof (read), 'function')

  // Alias path.
  const readAlias = require('../../read')
  t.is(typeof (readAlias), 'function')
  t.deepEqual(read, readAlias)
})
