# Packages

- [`hoast`](/packages/hoast) - The core package of hoast responsible for managing and running the other packages.

## Source packages

- [`source-custom`](/packages/source-custom) - Allows you to provide your own custom source functions. Extends base-source where the overridabel functions can be provided via the options. Helps you from having to create a package for simple one-off behaviour.
- [`source-readfiles`](/packages/source-readfiles) - Read files from the filesystem.

## Process packages

- [`process-custom`](/packages/process-custom) - Allows you to provide your own custom process functions. Extends base-process where the overridabel functions can be provided via the options. Helps you from having to create a package for simple one-off behaviour.
- [`process-frontmatter`](/packages/process-frontmatter) - Extract frontmatter from text.
- [`process-handlebars`](/packages/process-handlebars) - Template using [handlebars]().
- [`process-log`](/packages/process-log) - Log data to the terminal, useful for developing other process and source packages.
- [`process-markdown`](/packages/process-markdown) - Convert markdown text to html using [unified]().
- [`process-mithril`](/packages/process-mithril) - Template using [mithril]().
- [`process-parse`](/packages/process-parse) - Parse value using a function, default is `JSON.parse`.
- [`process-postprocess`](/packages/process-postprocess) - Process CSS, HTML, and JS data using Postcss and Babel plugins. Only minifies by default using cleancss, html-minifier-terser, and terser.
- [`process-writefiles`](/packages/process-writefiles) - Write data to the filesystem.

## For developers

- [`base-package`](/packages/base-package) - Provides basic functionality like receiving the app reference and setting up a logger.
- [`base-process`](/packages/base-process) - Provides basic functionality for process package like an initialization function, sequentially running of certain code, and filtering out running the process based of the data.
- [`base-source`](/packages/base-source) - Provides basic functionality for source package like an initialization function, sequentially running of certain code, and a finallize function called after the source is done iterating.
- [`utils`](/packages/utils) - A package of utility functions used by several other packages in this list.

## Package ideas

The ecosystem can always grow and find new problem to solve. A short list of ideas that might spark your imagination are written below. If you want to create one of these packages do let me know by creating an issue. I would love to help where I can.

### Source packages

- `source-graphql` - Retrieve data via GraphQL queries.
- `source-rest` - Retrieve data via restful calls.

### Process packages

- `process-query` - Extract and process queries from the given data. Perhaps via GrapQL or other external apis.
- `process-<render-library>` - More render methods are always welcome as everyone has a favourite or is already using one in a project they want to migrate over.
