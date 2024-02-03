# @hoast/process-custom

Allows you to provide your own custom process functions. Extends base-process where the overridable functions can be provided via the options. Helps you from having to create a package for simple one-off behaviour.

## Install

```ZSH
npm install @hoast/process-custom
```

## Options

This package extends the [@hoast/base-process](https://github.com/hoast/hoast/tree/main/packages/base-process#readme) package. For more information on how to use this package see the options below as well as the base package.

- `{Function} initialize = null` Initialize function.
- `{Function} sequential = null` Sequential function.
- `{Function} concurrent = null` Concurrent function.
- `{Function} final = null` Final function.

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/main/packages/utils#logger.js).
