# Source Javascript

Read and execute scripts from the filesystem.

## Install

```
$ npm install @hoast/source-javascript
```

## Options

- `{String} directory = 'src'` Directory path, either absolute or relative to the working directory.
- `{String} executeProperty = 'default'` Dot notation of property on imported object to execute.
- `{Array} filterPatterns = null` Glob patterns used to filter the file paths relative to the set directory with.
- `{Object} filterOptions` Pattern matching options.
  - `{Boolean} all = false` Whether all patterns have to match, or any match is sufficient.
  - `{Boolean} extended = false` Enable all advanced features from extglob.
  - `{String} flags = ''` RegExp flags (e.g. 'i' ) to pass to the RegExp constructor.
  - `{Boolean} globstar = false` If false the pattern 'path/*' will match any string beginning with 'path/', for example it will match 'path/file.txt' and 'path/to/file.txt'. If true the same 'path/*' will match any string beginning with 'path/' that does not have a '/' to the right of it, for example it will match 'path/file.txt' but not 'path/to/file.txt'. If true the pattern 'path/**' will match any string beginning with 'path/', which is equal to the 'path/*' with globstar set to false.
  - `{Boolean} strict = false` Be forgiving about multiple slashes, such as /// and make everything after the first / optional. Like how bash glob works.
- `{Array<String>} watchIgnore = [ '**/node_modules/**' ]` Paths of files to ignore marking as dependencies when watching for changes.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/main/packages/utils#logger.js).
