# @hoast/process-javascript

Retrieve and execute JavaScript.

## Install

```
% yarn add @hoast/process-javascript
```

OR

```
% npm install @hoast/process-javascript --save
```

## Options

- `{String} setProperty = 'contents'` Dot notation path to the data property to which the result should be written.
- `{String} executeProperty = 'default'` Dot notation of property on imported object to execute.
- `{String} importProperty = 'default'` Dot notation of property path of script's file path.
- `{String} importPath = 'default'` File path of the script to execute, if know file path on data is found.
- `{Array<String>} watchIgnore = [ '**/node_modules/**' ]` Paths of files to ignore marking as dependencies when watching for changes.

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).
