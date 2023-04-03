# @hoast/source-airtable

Read data from Airtable bases.

## Install

```
$ npm install @hoast/source-airtable
```

## Options

- `{Boolean} cache = true` Whether the Airtable API responses should be cached, useful in development mode to prevent waiting for request responses.
- `{Boolean} token` Authorization token for the Airtable API.
- `{Boolean} baseId` ID of the Airtable base to source from.
- `{String} mode = 'table'` When the mode is set to `table` it will iterate over all tables in the base. When the mode is set to `row` it will iterate over all rows in a table.
- `{String} tableIdOrName = null` The name of the table to read the rows from. Only applicable when mode is set to `'rows'`.
- `{Boolean} tableWithRows = true` Whether to retrieve all the rows of the table. Only applicable when mode is set to `'table'`.
- `{Array} filterPatterns = null` Glob patterns used to filter the file paths relative to the set directory with.
- `{Object} filterOptions` Pattern matching options.
  - `{Boolean} all = false` Whether all patterns have to match, or any match is sufficient.
  - `{Boolean} extended = false` Enable all advanced features from extglob.
  - `{String} flags = ''` RegExp flags (e.g. 'i' ) to pass to the RegExp constructor.
  - `{Boolean} globstar = false` If false the pattern 'path/*' will match any string beginning with 'path/', for example it will match 'path/file.txt' and 'path/to/file.txt'. If true the same 'path/*' will match any string beginning with 'path/' that does not have a '/' to the right of it, for example it will match 'path/file.txt' but not 'path/to/file.txt'. If true the pattern 'path/**' will match any string beginning with 'path/', which is equal to the 'path/*' with globstar set to false.
  - `{Boolean} strict = false` Be forgiving about multiple slashes, such as /// and make everything after the first / optional. Like how bash glob works.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).
