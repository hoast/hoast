# @hoast/process-postprocess

Process CSS, HTML, and JS data using [PostCSS](https://github.com/postcss/postcss#readme), [Unified's rehype](https://github.com/rehypejs/rehype#readme), and [Babel](https://github.com/babel/babel#readme) plugins and minify using [CleanCSS](https://github.com/cssnano/cssnano#readme), [Unified's rehype](https://github.com/rehypejs/rehype#readme), and [Terser](https://github.com/terser/terser#readme).

## Install

```
$ npm install @hoast/process-postprocess
```

## Options

- `{String} property = 'contents'` Dot notation path to the data property which should be used processed by Mithril.
- `{String} mode = 'html'` Whether to process the data as either `css`, `cjs`, `html`, or `js`, `mjs`, `ts`. Set to either of those options. The `cjs`, `mjs`, and `ts` modes do not process the data differently and only influence how the dependencies are read when watching for changes.
- `{Boolean} minify = true` Whether to minify.
- `{Array} documentPlugins = []` [`unified rehype` plugins](https://github.com/rehypejs/rehype#readme).
- `{Object} scriptMinifyOptions = {}` [`terser` options](https://github.com/terser/terser#readme). Set to `false` to disable JS minification.
- `{Object} scriptOptions = {}` [`babel` options](https://github.com/babel/babel#readme).
- `{Object} styleMinifyOptions = {}` [`cssnano` options](https://github.com/cssnano/cssnano#readme). Set to `false` to disable CSS minification.
- `{Object} styleOptions = {}` [`postcss` options](https://github.com/postcss/postcss#readme).
- `{Array} stylePlugins = []` [`postcss` plugins](https://github.com/postcss/postcss#readme).

- `{Function} filter = null` Custom filter function. The item data is given as the parameter. Return `true` if it should be processed, return `false` if this processor should be skipped.

- `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/main/packages/utils#logger.js).
