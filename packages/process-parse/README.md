# @hoast/process-parse

Parse a text value using a function or package.

## Install

```
% yarn add @hoast/process-parse
```

OR

```
% npm install @hoast/process-parse --save
```

## Options

- `{String} property = 'contents'` Dot notation path to the data property which should be used processed by the parser.
- `{Function} parser = JSON.parse` Function which parse the value at the property path.
