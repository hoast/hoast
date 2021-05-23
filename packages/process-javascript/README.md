# @hoast/process-javascript

Retrieve and execute JavaScript.

## Install

```
$ npm install @hoast/process-javascript
```

## Example

### Input

File located at `components/h1.js`.

```JS
export default function({ contents }) {
  return '<h1>' . contents . '</h1>';
}
```

File located at `pages/index.html`.

```HTML
Hello world!
```

### Config

```JS
export default {
  collections: [{
    source: ['@hoast/source-readfiles', {
      directory: 'pages',
    }],
    processes: [
      ['@hoast/process-javascript', {
        importPath: 'components/h1.js',
      }],
      '@hoast/process-log',
    ],
  }],
}
```

### Output

```HTML
<h1>Hello world!</h1>
```

## Options

- `{String} setProperty = 'contents'` Dot notation path to the data property to which the result should be written.
- `{String} executeProperty = 'default'` Dot notation of property on imported object to execute.
- `{String} importProperty = 'default'` Dot notation of property path of script's file path.
- `{String} importPath = 'default'` File path of the script to execute, if know file path on data is found.
- `{Array<String>} watchIgnore = [ '**/node_modules/**' ]` Paths of files to ignore marking as dependencies when watching for changes.

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).
