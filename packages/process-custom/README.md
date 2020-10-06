# @hoast/process-custom

Allows you to provide your own custom process functions. Extends base-process where the overridabel functions can be provided via the options. Helps you from having to create a package for simple one-off behaviour.

## Install

```
% yarn add @hoast/process-custom
```

OR

```
% npm install @hoast/process-custom --save
```

## Usage

This package extends the [@hoast/base-process](https://github.com/hoast/hoast/tree/master/packages/base-process) package. For more information on how to use this package see the options below as well as the base package.

- `constructor` Create package instance.
  - `@param {Object} ...Options` Options objects which can contain the following keys.
    - `{Function} initialize = null` Initialize function.
    - `{Function} sequential = null` Sequential function.
    - `{Function} concurrent = null` Concurrent function.
    - `{Function} final = null` Final function.

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
