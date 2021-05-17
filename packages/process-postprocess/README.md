# @hoast/process-postprocess

Process CSS, HTML, and JS data using [`postcss`](https://github.com/postcss/postcss#readme) and [`babel`](https://github.com/babel/babel#readme) plugins and minify using [`cssnano`](https://github.com/cssnano/cssnano#readme), [`html-minifier-terser`](https://github.com/terser/html-minifier-terser#readme), and [`terser`](https://github.com/terser/terser#readme).

## Install

```
% yarn add @hoast/process-postprocess
```

OR

```
% npm install @hoast/process-postprocess --save
```

## Options

- `{String} property = 'contents'` Dot notation path to the data property which should be used processed by Mithril.
- `{String} mode = 'html'` Whether to process the data as either `css`, `cjs`, `html`, or `js`, `mjs`, `ts`. Set to either of those options. The `cjs`, `mjs`, and `ts` modes do not process the data differently and only influence how the dependencies are read when watching for changes.
- `{Boolean} minify = true` Whether to minify.
- `{Object} scriptMinifyOptions = {}` [`terser` options](https://github.com/terser/terser#readme). Set to `false` to disable JS minification.
- `{Object} scriptOptions = {}` [`babel` options](https://github.com/babel/babel#readme).
- `{Object} styleMinifyOptions = {}` [`cssnano` options](https://github.com/cssnano/cssnano#readme). Set to `false` to disable CSS minification.
- `{Object} styleOptions = {}` [`postcss` options](https://github.com/postcss/postcss#readme).
- `{Array} stylePlugins = []` [`postcss` plugins](https://github.com/postcss/postcss#readme).

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).
