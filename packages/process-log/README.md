# @hoast/process-log

Log data to the terminal, useful for developing other process and source packages.

## Install

```
$ npm install @hoast/process-log
```

## Options

- `{String} property = null` Dot notation path to the data property which should be logged.
- `{String} format = 'js'` In what format to log the data. Either `js` or `json`.
- `{String} level = 'info'` What console command to output the data with. Either `info`, `warn`, or `error`.
- `{String} prepend = null` Text to prepend to the message.
- `{String} append = null` Text to append to the message.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/main/packages/utils#logger.js).
