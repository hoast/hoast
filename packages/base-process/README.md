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

### Constructor

- `constructor` Create package instance.
  - `@param {Object} ...Options` Options objects which can contain the following keys.
    - `{Function} filterCustom = null` Custom filter function. The item data is given as the parameter. Return true if it should be processed, return false if this should skip this processor.
    - `{Array} filterPatterns = null` Glob patterns used to filter with.
    - `{String} filterProperty = null` Dot notation path to the data property to match the patterns against.
    - `{Object} filterOptions` Pattern matching options.
      - `{Boolean} all = false` Whether all patterns have to match, or any match is sufficient.
      - `{String} array = 'any'` Which item(s) to check if the value checked against is an array. Either `all`, `any`, `first`, or `last`.
      - `{Boolean} extended = false` Enable all advanced features from extglob.
      - `{String} flags = ''` RegExp flags (e.g. 'i' ) to pass to the RegExp constructor.
      - `{Boolean} globstar = false` If false the pattern 'path/*' will match any string beginning with 'path/', for example it will match 'path/file.txt' and 'path/to/file.txt'. If true the same 'path/*' will match any string beginning with 'path/' that does not have a '/' to the right of it, for example it will match 'path/file.txt' but not 'path/to/file.txt'. If true the pattern 'path/**' will match any string beginning with 'path/', which is equal to the 'path/*' with globstar set to false.
      - `{Boolean} isPath = false` Whether the text matched against is a path.
      - `{Boolean} strict = false` Be forgiving about multiple slashes, such as /// and make everything after the first / optional. Like how bash glob works.

    - `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).

### Variables

- `{Boolean} _hasInitialize` True if the derived class has a `initialize` function.
- `{Boolean} _hasSequential` True if the derived class has a `sequential` function.
- `{Boolean} _hasConcurrent` True if the derived class has a `concurrent` function.

- `{Array} _filterExpressions` Parsed `options.filterPatterns` values as regular expressions.
- `{Array} _filterPropertyPath` Parsed `options.filterProperty` value as series of strings.

#### Inherited

- `{Object} _app` Hoast instance.
- `{Object} _options` Merged options.
- `{Object} _logger` [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js) instance.

### Functions

- `async next` This will be called by hoast itself to process the given item.
  - `@param {Any} data` Data to process.
  - `@returns {Any}` Item to be processed.
- `async _next` Internally called to process the given item.
  - `@param {Any} data` Data to process.
  - `@returns {Any}` Item to be processed.

#### Inherited

- `_setApp` Set app reference. This will be called by hoast itself before the next function is called.
  - `@params {Object} app` hoast instance.

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
