/**
 * Execute functions returned by the iterator until null is returned.
 * @param {Function} next Function to call when a new process can be run.
 * @param {number} limit Maximum number of iterators to have running at once.
 * @returns {Promise} Limited concurrent process as a promise.
 */
const iterate = function (
  iterator,
  limit = 1,
) {
  // Track active calls.
  let count = 0
  let index = -1

  return new Promise((resolve, reject) => {
    const add = () => {
      // Increment count.
      index++
      count++

      // Resolve given value.
      Promise.resolve(iterator.next(index))
        .then(() => {
          // Reduce count.
          count--

          // Add another one in its place.
          if (!iterator.exhausted) {
            add()
          } else if (count <= 0) {
            // If the last active one then resolve.
            resolve()
          }
        }, (error) => {
          reject(error)
        })
    }

    for (let i = 0; i < limit; i++) {
      if (iterator.exhausted) {
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
