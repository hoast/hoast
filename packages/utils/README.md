# @hoast/utils

Utility functions commonly used by hoast and hoast packages. A list of all the files and exported functions can be seen below. Simply import by the package name followed by the file path, for example `import deepAssign from '@hoast/utils/deepAssign.js'`. If a file exports multiple functions the default export will be object with all the functions on it.

## deepAssign.js

Deeply assign a series of objects properties together.
- `@param {Object} target` Target object to assign onto.
- `@param  {...Object} sources` Sources to assign with.
- `@returns {Object}` Target object with sources values assigned.

## deepMerge.js

Deeply assign a series of arrays and or objects properties together.
- `@param {Any} target` Target to merge onto.
- `@param  {...Any} sources` Sources to merge with.
- `@returns {Object}` Target object with sources values merged.

## iterateDirectory.js

Creates recursive directory iterator. Call the returned function again and again to receive a file path. Returns `null` when all values have been iterated over.
- `@param {String} directoryPath` Absolute directory path.
- `@returns {Function}` Recursive directory iterator function.

## get.js

### getByDotNotation

Get a value from a source by a dot seperated path.
- `@param {Object} source` The object to retrieve a value from.
- `@param {String} path` Dot notation string with each segment a property on the source.
- `@returns {Any}` Value at path.

### getByPathSegments

Get a value from a source by an array seperated path.
- `@param {Object} source` The object to retrieve a value from.
- `@param {Array<String>}` path Array of strings with each segment a property on the source.
- `@returns {Any}` Value at path.

## has.js

Check if an object has the required properties.
- `@param {Object} value` Value to check.
- `@param {Array} propertyNames` Array of property names.
- `@returns {Boolean}` Whether the value is an object and the properties exist.

## instantiate.js

Instantiate a value. If the value is an array the first item is assumed to be the value and the others become parameters given to the constructor.
- `@param {Any} value` Value to import and or instantiate. A string will be dynamically imported.
- `@returns {Object}` The imported and instantiated object.

## is.js

### isClass

Checks if value is a class.
- `@param {Any}` value Value to check.
- `@returns {Boolean}` Whether the value is a class.

### isObject

Check whether the value is an object.
- `@param {Any}` value Value of unknown type.
- `@returns {Boolean}` Whether the value is an object.

## Logger.js

Logger class usefull for only allowing messages to be send to the console of the right level is set.

- `constructor` Create logger instance.
  - `@param {Number} level` Log level.
  - `@param {String} prefix` Prefix of logged messages.

- `getLevel` Get log level value.
  - `@returns {Number}` log level value.

- `setLevel` Set log level value.
  - `@param {Number} level` Log level value.

- `getPrefix` Get log prefix value.
  - `@returns {String}` Log prefix value.

- `setPrefix` Set log prefix value.
  - `@param {Number} prefix` Log prefix value.

- `info` Logs info message to console if level is greater than 2.
  - `@param {String} message` Message to output.
  - `@param  {...Any} optionalParams` Additional optional parameters.

- `warn` Logs warning message to console if level is greater than 1.
  - `@param {String} message` Message to output.
  - `@param  {...Any} optionalParams` Additional optional parameters.

- `error` Logs error message to console if level is greater than 1.
  - `@param {String} message` Message to output.
  - `@param  {...Any} optionalParams` Additional optional parameters.

- `trace` Logs trace to console.
  - `@param {String} message` Message to output.
  - `@param  {...Any} optionalParams` Additional optional parameters.

## set.js

### setByDotNotation

Set a value on a target by a dot seperated path.
- `@param {Object} target` Target object to set value to.
- `@param {String} path` Dot notation string with each segment a property on the target.
- `@param {Any} value` The value to set at the path on the target.
- `@returns {Object}` Target object with the value set to it.

### setByPathSegments

Set a value on a target by an array seperated path.
- `@param {Object} target` Target object to set value to.
- `@param {Array<String>} path` Array of strings with each segment a property on the target.
- `@param {Any} value` The value to set at the path on the target.
- `@returns {Object}` Target object with the value set to it.

## trim.js

### trimStart

Trim a specific character from the start of a string.
- `@param {String} string` String to trim.
- `@param {String} character` Character to trim.
- `@returns {String}` Trimmed string.

### trim

Trim a specific character from the start and end of a string.
- `@param {String} string` String to trim.
- `@param {String} character` Character to trim.
- `@returns {String}` Trimmed string.

### trimEnd

Trim a specific character from the end of a string.
- `@param {String} string` String to trim.
- `@param {String} character` Character to trim.
- `@returns {String}` Trimmed string.
