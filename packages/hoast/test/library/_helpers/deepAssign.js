// Dependency modules.
const test = require('ava')
// Library modules.
const Hoast = require('../../../library')

test('type check', function(t) {
  const hoast = Hoast(__dirname)

  t.is(typeof (Hoast.helpers.deepAssign), 'function')
  t.is(typeof (hoast.helpers.deepAssign), 'function')
  t.is(Hoast.helpers.deepAssign, hoast.helpers.deepAssign)
})

test('modify primary parameter', function(t) {
  const object = {}
  t.is(Hoast.helpers.deepAssign(object), object)
  t.is(Hoast.helpers.deepAssign(object, {}), object)
  t.is(Hoast.helpers.deepAssign(object, {
    a: 'a',
  }), object)

  t.not(Hoast.helpers.deepAssign({}, object), object)
})

test('assign', function(t) {
  t.deepEqual(Hoast.helpers.deepAssign({
    a: 'a',
  }, {}), {
    a: 'a',
  })
  t.deepEqual(Hoast.helpers.deepAssign({}, {
    a: 'a',
  }), {
    a: 'a',
  })
})

test('assign deeply', function(t) {
  t.deepEqual(Hoast.helpers.deepAssign({
    a: {
      b: 'b',
    },
  }, {}), {
    a: {
      b: 'b',
    },
  })
  t.deepEqual(Hoast.helpers.deepAssign({}, {
    a: {
      b: 'b',
    },
  }), {
    a: {
      b: 'b',
    },
  })
})

test('merge', function(t) {
  t.deepEqual(Hoast.helpers.deepAssign({
    a: 'a',
  }, {
    b: 'b',
  }), {
    a: 'a',
    b: 'b',
  })
})

test('merge deeply', function(t) {
  t.deepEqual(Hoast.helpers.deepAssign({
    a: {
      b: 'b',
    },
  }, {
    a: {
      c: 'c',
    },
  }), {
    a: {
      b: 'b',
      c: 'c',
    },
  })
})

test('overwrite', function(t) {
  t.deepEqual(Hoast.helpers.deepAssign({
    a: 'a',
  }, {
    a: 'b',
  }), {
    a: 'b',
  })
})

test('overwrite deeply', function(t) {
  t.deepEqual(Hoast.helpers.deepAssign({
    a: {
      b: 'b',
    },
  }, {
    a: {
      b: 'c',
    },
  }), {
    a: {
      b: 'c',
    },
  })
})

test('multiple sources', function(t) {
  t.deepEqual(Hoast.helpers.deepAssign({
    a: 'a',
  }, {
    b: 'b',
  }, {
    c: 'c',
  }), {
    a: 'a',
    b: 'b',
    c: 'c',
  })
})

test('discard invalid parameters', function(t) {
  t.deepEqual(Hoast.helpers.deepAssign(1), 1)
  t.deepEqual(Hoast.helpers.deepAssign(1, 2), 1)
  t.deepEqual(Hoast.helpers.deepAssign({}, 2), {})
  t.deepEqual(Hoast.helpers.deepAssign({
    a: 'a',
  }, 2, {
    b: 'b',
  }), {
    a: 'a',
    b: 'b',
  })
})
