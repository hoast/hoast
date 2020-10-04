# Base process

Provides basic functionality for process package like an initialization function, sequentially running of certain code, and filtering out running the process based of the data. Meant for developers to be used as a base for a [hoast](https://hoast.js.org) process package.

## Usage

### Constructor

- `constructor` Create package instance.
  - `@param {Object} ...Options` Options objects which can contain the following key.
    - `{Function} filterCustom = null` TODO:
    - `{Array} filterPatterns = null` TODO:
    - `{String} filterProperty = null` TODO:
    - `{Object} filterOptions` TODO:
      - `{Boolean} all = false`
      - `{String} array = 'any'` Possible values are `all`, `any`, `first` and `last`.
    - `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).

### Variables

- `{Boolean} _hasInitialize` True if the derived class has a `initialize` function.
- `{Boolean} _hasSequential` True if the derived class has a `sequential` function.
- `{Boolean} _hasConcurrent` True if the derived class has a `concurrent` function.

- `{Array} _filterExpressions`
- `{Array} _filterPropertyPath`

#### Inherited

- `{Object} _app` Hoast instance.
- `{Object} _options` Merged options.
- `{Object} _logger` [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js) instance.

### Functions

- `async next` Process given item.
  - `@param {Any} data` Data to process.
  - `@returns {Any}` Item to be processed.
- `async _next` Retrieve next item.
  - `@param {Any} data` Data to process.
  - `@returns {Any}` Item to be processed.

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
