# @hoast/process-pdf

Converts HTML to PDF using [Puppeteer](https://github.com/puppeteer/puppeteer#readme).

## Install

```
% yarn add @hoast/process-pdf
```

OR

```
% npm install @hoast/process-pdf --save
```

## Options

- `{String} property = 'contents'` Dot notation path to the data property which should be processed.
- `{String} setProperty = 'contents'` Dot notation path to the data property to which the result should be written.
- `{String} optionsProperty = false` Optional dot notation path to [Puppeteer PDF options](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagepdfoptions) property on the data. Will override the `pdfOptions` option.
- `{String} mediaType = false` Set to either `print` or `screen` to [change the pages media type](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pageemulatemediatypetype).
- `{Object} pdfOptions = {}` [Puppeteer PDF options](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagepdfoptions). Will be overwritten by data at the `optionsProperty` path.
- `{Object} serveOptions = {}` Options for local server handling HTML requests from puppeteer.
  - `{String} directory = null` Directory to server from, can be relative to process directory or an absolute directory.
  - `{Number} port = 3000` Port to serve from and link to.
- `{String} wrap = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>{0}</body></html>'` The string to wrap the content with where `{0}` indicates the place for the content. Set to `false` to disable wrapping.

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).

## Security risk

Note this module serves the `process.cwd()` or `serveOptions.directory` directory to the local network whilst it is processing files. This can be a potential security risk and expose information to the network you might not want to make available.
