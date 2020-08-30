/**
 * Execute functions returned by the iterator until null is returned.
 * @param {Function} next Function to call when a new process can be run.
 * @param {Number} limit Maximum number of iterators to have running at once.
 * @returns {Promise} Limited concurrent process as a promise.
 */
const iterate = function (next, limit = 1) {
  // Track active calls.
  let count = 0

  return new Promise((resolve, reject) => {
    const add = () => {
      // Get next value.
      const value = next()

      // Increment count.
      count++

      // Resolve given value.
      Promise.resolve(value)
        .then(() => {
          // Reduce count.
          count--

          // Add another one in its place.
          if (!next.done) {
            add()
          }

          // Check if this was the last one.
          if (count <= 0) {
            resolve()
          }
        })
        .error((error) => {
          reject(error)
        })
    }

    while (count < limit) { // eslint-disable-line no-unmodified-loop-condition
      if (next.done) {
        break
      }

      add()
    }

    // If nothing was added then resolve immediately.
    if (count === 0) {
      resolve()
    }
  })
}

export default iterate
