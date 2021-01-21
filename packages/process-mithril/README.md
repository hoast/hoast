# @hoast/process-mithril

Template using [Mithril](https://github.com/MithrilJS/mithril.js#readme).

## Install

```
% yarn add @hoast/process-mithril
```

OR

```
% npm install @hoast/process-mithril --save
```

## Options

- `{String} property = 'contents'` Dot notation path to the data property which should be processed.
- `{String} componentDirectory = null` Component directory path, either absolute or relative to the working directory.
- `{String} componentPath = null` Default component path relative to the component directory.
- `{String} componentProperty = null` Dot notation path to the data property where the component path can be written.
- `{String} prefix = null` Text to prepend to the result. For instance `<!DOCTYPE html>` if you are generating an entire webpage using mithril.
- `{String} suffix = null` Text to append to the result.

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).
