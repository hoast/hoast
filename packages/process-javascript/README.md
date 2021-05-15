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

- `{String} importProperty = 'path'` Dot notation path to the data property from which the dynamic importing path should be taken.
- `{Object} importOptions` Dynamic importing options. Set to `false` to disable dynamic importing.
  - `{String} extractName = 'default'` The name of the item to import from the imported code.
  - `{String} setProperty = 'contents'` Dot notation path to the data property to which the imported code should be written.
- `{String} executeProperty = 'contents'` Dot notation path to the data property which should be executed. This option is ignored if the code is dynamically imported from the path at the `importProperty` option.
- `{Object} executeOptions` Code execution options. Set to `false` to disable code execution.
  - `{Array<String>} functionNames = ['']` Names of the functions to call on the code. If multiple names are given the function is called on the data returned by the earlier function call. An empty string will assume the value itself is a function and call it instead.
  - `{String} setProperty = 'contents'` Dot notation path to the data property to which the result of the function call should be written.

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).
