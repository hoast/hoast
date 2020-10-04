# Base source

Provides basic functionality for source package like an initialization function, sequentially running of certain code, and a finallize function called after the source is done iterating. Meant for developers to be used as a base for a [hoast](https://hoast.js.org) source package.

## Usage

### Constructor

- `constructor` Create package instance.
  - `@param {Object} ...Options` Options objects which can contain the following key.
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

- `{Object} _app` Hoast instance.
- `{Object} _options` Merged options.
- `{Object} _logger` [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js) instance.

### Functions

- `async next` Retrieve next item.
  - `@returns {Any}` Retrieved data.
- `async _next` Retrieve next item.
  - `@returns {Any}` Retrieved data.

#### Inherited

- `_setApp` Set app reference.
  - `@params {Object} app` hoast instance.

### Abstract functions

The following functions can be implimented by the derived class and will automatically called if present.

- `async initialize` TODO:
- `async sequential` TODO:
  - `@returns {Any}` TODO:
- `async concurrent` TODO:
  - `@params {Any}` TODO:
  - `@returns {Any}` TODO:
- `async final` TODO:
