// Dependency modules.
const test = require('ava')
// Library modules.
const Hoast = require('../../../library')

test('type check', function(t) {
  const hoast = Hoast(__dirname)

  t.is(typeof (Hoast.helpers.parsePatterns), 'function')
  t.is(typeof (hoast.helpers.parsePatterns), 'function')
  t.is(Hoast.helpers.parsePatterns, hoast.helpers.parsePatterns)
})

test('type check legacy', function(t) {
  const hoast = Hoast(__dirname)

  t.is(typeof (Hoast.helper.parse), 'function')
  t.is(typeof (hoast.helper.parse), 'function')
  t.is(Hoast.helper.parse, hoast.helper.parse)
  t.is(Hoast.helper.parse, Hoast.helpers.parsePatterns)
})

test('compare against \'planckmatch/parse\'', function(t) {
  t.is(Hoast.helpers.parsePatterns, require('planckmatch/parse'))
})
