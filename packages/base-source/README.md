# @hoast/base-source

Provides basic functionality for source package like an initialization function, sequentially running of certain code, and a finallize function called after the source is done iterating. Meant for developers to be used as a base for a [hoast](https://hoast.js.org) source package.

## Install

```
% yarn add @hoast/base-source
```

OR

```
% npm install @hoast/base-source --save
```

## Usage

### Constructor

- `constructor` Create package instance.
  - `@param {Object} ...Options` Options objects which can contain the following keys.
    - `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).

### Variables

- `{Boolean} done` Is set to true if all items are returned.
- `{Boolean} exhausted` Set `exhausted` to true if the source has ran out of items to return.

- `{Boolean} _hasInitialize` True if the derived class has a `initialize` function.
- `{Boolean} _hasSequential` True if the derived class has a `sequential` function.
- `{Boolean} _hasConcurrent` True if the derived class has a `concurrent` function.
- `{Boolean} _hasFinal` True if the derived class has a `final` function.

- `{Boolean} _holdCalls` Whether next calls are temporarily held while the initialize or sequential function is running.
- `{Array} _promiseQueue` A queue of next calls that gets added to while hold calls is true.

#### Inherited

- `{Object} _library` Hoast instance.
- `{Object} _options` Merged options.
- `{Object} _logger` [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js) instance.

### Functions

- `async next` This will be called by hoast itself to retrieve the next item.
  - `@returns {Any}` Retrieved data.
- `async _next` Internally called to retrieve the next item.
  - `@returns {Any}` Retrieved data.

#### Inherited

- `_setLibrary` Set app reference. This will be called by hoast itself before the next function is called.
  - `@params {Object} app` hoast instance.

### Abstract functions

The following functions can be implimented by the derived class and will automatically called if present. All functions are optional and don't have to be asynchronous.

- `async initialize` Called only once before sequential and concurrent.
- `async sequential` Called sequentially for each iteration call. Meaning while this method is running it won't be called until the ongoing call is finished. Useful for processes that have to happen in order. Useful for iterating over the items in the filesystem.
  - `@returns {Any}` Item.
- `async concurrent` Called concurrently for each iteration call after the sequential call. Meaning this will run after the sequential call and in contrast to the sequential function will be called before a previous call has finished. Useful for reading file contents from the filesystem.
  - `@params {Any}` Data returned by the sequential method.
  - `@returns {Any}` Item.
- `async final` Called after the source has been exhausted and is finished.

### Example

```JavaScript
// Import base modules.
import BaseSource from '@hoast/base-source'

class NewSource extends BaseSource {
  constructor(options) {
    super({
      // Default options.
    }, options)
  }

  async initialize() {
    // Initialize.
  }

  async sequential() {
    // Sequential.
    this.exhausted = true
    return {}
  }

  async concurrent(data) {
    // Concurrent.
    return data
  }

  async final() {
    // Final.
  }
}

export default NewSource
```

See the [@hoast/source-readfiles](https://github.com/hoast/hoast/tree/master/packages/source-readfiles#readme) package for another example.
