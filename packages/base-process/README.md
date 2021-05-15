# @hoast/base-process

Provides basic functionality for process package like an initialization function, sequentially running of certain code, and filtering out running the process based of the data. Meant for developers to be used as a base for a [hoast](https://hoast.js.org) process package.

## Install

```
% yarn add @hoast/base-process
```

OR

```
% npm install @hoast/base-process --save
```
## Usage

> Extends [BasePackage](https://github.com/hoast/hoast/tree/master/packages/base-package#readme).

### Constructor

- `constructor` Create package instance.
  - `@param {Object} ...Options` Options objects which can contain the following keys.
    - `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

    - `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).

### Variables

- `{Boolean} _hasInitialize` True if the derived class has a `initialize` function.
- `{Boolean} _hasSequential` True if the derived class has a `sequential` function.
- `{Boolean} _hasConcurrent` True if the derived class has a `concurrent` function.

- `{Array} _filterExpressions` Parsed `options.filterPatterns` values as regular expressions.
- `{Array} _filterPropertyPath` Parsed `options.filterProperty` value as series of strings.

### Functions

- `async next` This will be called by hoast itself to process the given item.
  - `@param {Any} data` Data to process.
  - `@returns {Any}` Item to be processed.

### Abstract functions

The following functions can be implimented by the derived class and will automatically called if present. All functions are optional and don't have to be asynchronous.

- `async initialize` Called only once before sequential and concurrent.
- `async sequential` Called sequentially for each iteration call. Meaning while this method is running it won't be called until the ongoing call is finished.
  - `@params {Any}` Item.
  - `@returns {Any}` Item.
- `async concurrent` Called concurrently for each iteration call after the sequential call. Meaning this will run after the sequential call and in contrast to the sequential function will be called before a previous call has finished.
  - `@params {Any}` Item.
  - `@returns {Any}` Item.
- `async final` Called after the processor has iterated over all data.

### Example

```JavaScript
// Import base modules.
import BaseProcess from '@hoast/base-process'

class NewProcess extends BaseProcess {
  constructor(options) {
    super({
      // Default options.
    }, options)
  }

  async initialize() {
    // Initialize.
  }

  async sequential(data) {
    // Sequential.
    return data
  }

  async concurrent(data) {
    // Concurrent.
    return data
  }

  async final() {
    // Final.
  }
}

export default NewProcess
```

See the [@hoast/process-writefiles](https://github.com/hoast/hoast/tree/master/packages/process-writefiles#readme) package for another example.
