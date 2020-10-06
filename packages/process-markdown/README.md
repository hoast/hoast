# @hoast/process-markdown

Convert markdown to HTML using [Unified](https://github.com/unifiedjs/unified#readme).

## Install

```
% yarn add @hoast/process-markdown
```

OR

```
% npm install @hoast/process-markdown --save
```

## Options

- `{String} property = 'contents'` Dot notation path to the data property which should be processed as markdown.
- `{Array} remarkPlugins = []` Remark plugins. If the value in the array is an array the first will be instantiated if not already an instance, the subsequent values will be used as the plugin's options.
- `{Array} rehypePlugins = []` Rehype plugins. If the value in the array is an array the first will be instantiated if not already an instance, the subsequent values will be used as the plugin's options.

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).
