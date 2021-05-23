# @hoast/base-source

Provides basic functionality for source package like an initialization function, sequentially running of certain code, and a finallize function called after the source is done iterating. Meant for developers to be used as a base for a [hoast](https://hoast.js.org) source package.

## Install

```
$ npm install @hoast/base-source
```

## Usage

> Extends [BasePackage](https://github.com/hoast/hoast/tree/master/packages/base-package#readme).

### Constructor

- `constructor` Create package instance.
  - `@param {Object} ...Options` Options objects which can contain the following keys.
    - `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).

### Variables

- `{Boolean} done` Is set to true if all items are returned.
- `{Boolean} exhausted` Set `exhausted` to true if the source has ran out of items to return.

### Functions

- `async next` Will be called by hoast itself to retrieve the next item.
  - `@returns {Any}` Retrieved data.

### Abstract functions

The following functions can be implemented by the derived class and will automatically called if present. All functions are optional and don't have to be asynchronous.

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
