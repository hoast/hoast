/**
 * Start a timer, call the returned function to stop the timer and get the result.
 * @returns {Function} Returns a function to stop the timer which returns the result.
 */
const timer = function () {
  // Store start time.
  const start = process.hrtime()

  // Get time end function.

  return function (precision = 3) {
    // Store end time.
    const end = process.hrtime(start)
    // Return result time.
    return (end[0] + (end[1] / 1e9)).toFixed(precision)
  }
}

export default timer
