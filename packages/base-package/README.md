# @hoast/base-package

Provides basic functionality like receiving the library's reference and setting up a logger. Meant for developers to be used as a base for a [hoast](https://hoast.dev) source or process package.

## Install

```
$ npm install @hoast/base-package
```

## Usage

### Constructor

- `constructor` Create package instance.
  - `@param {Object} ...Options` Options objects which can contain the following key.
    - `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).

### Functions

- `getOptions` Get merged options.
  - `@returns {Object}` options.
- `getLibrary` Get the `hoast` instance that the module is part of.
  - `@returns {Hoast}` hoast instance.
- `setLibrary` Set library reference. This will be called by `hoast` itself before the next function is called.
  - `@params {Hoast} library` hoast instance.
- `getLogger` Get the logger instance.
  - `@returns {Logger}` logger instance.

### Example

```JavaScript
// Import base modules.
import BasePackage from '@hoast/base-package'

class NewPackage extends BasePackage {
  constructor(options) {
    super({
      // Default options.
    }, options)
  }
}

export default NewPackage
```

See the [@hoast/process-log](https://github.com/hoast/hoast/tree/master/packages/process-log#readme) package for another example.
