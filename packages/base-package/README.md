# Base package

Provides basic functionality like receiving the app reference and setting up a logger. Meant for developers to be used as a base for a [hoast](https://hoast.js.org) source or process package.

## Usage

### Constructor

- `constructor` Create package instance.
  - `@param {Object} ...Options` Options objects which can contain the following key.
    - `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).

### Variables

- `{Object} _app` Hoast instance.
- `{Object} _options` Merged options.
- `{Object} _logger` [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js) instance.

### Functions

- `_setApp` Set app reference. This will be called by hoast itself before the next function is called.
  - `@params {Object} app` hoast instance.
