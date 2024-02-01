# @hoast/process-frontmatter

Extract frontmatter from text.

## Install

```
$ npm install @hoast/process-frontmatter
```

## Options

- `{String} property = 'contents'` Dot notation path to the data property from which frontmatter should be read.
- `{String} frontmatterProperty = 'frontmatter'` Dot notation path to the data property to which the extracted frontmatter should be written.
- `{String} fence = '---'` The text which marks the start and end of the frontmatter portion.
- `{Function} parser = JSON.parse` Function which parses the extracted frontmatter text.

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/main/packages/utils#logger.js).
