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
- `{Objecgt} pdfOptions = {}` [Puppeteer PDF options](https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#pagepdfoptions). Will be overwritten by data at the `optionsProperty` path.
- `{String} wrap = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>{0}</body></html>'` The string to wrap the content with where `{0}` indicates the place for the content. Set to `false` to disable wrapping.

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).

## Security risk

TODO: Note this module servers the `process.cwd()` or `serveOptions.directory` directory to the local network whilst it is processing files.
