# @hoast/source-custom

Allows you to provide your own custom source functions. Extends base-source where the overridabel functions can be provided via the options. Helps you from having to create a package for simple one-off behaviour.

## Install

```
% yarn add @hoast/source-custom
```

OR

```
% npm install @hoast/source-custom --save
```

## Options

This package extends the [@hoast/base-source](https://github.com/hoast/hoast/tree/master/packages/base-source#readme) package. For more information on how to use this package see the options below as well as the base package.

- `{Function} initialize = null` Initialize function.
- `{Function} sequential = null` Sequential function.
- `{Function} concurrent = null` Concurrent function.
- `{Function} final = null` Final function.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).
