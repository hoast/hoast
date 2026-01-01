<div align="center">

![Project logo](docs-src/src/assets/icons/256-round.png)

</div>

# Hoast

A set of simple and modular packages for build automation.

Creating a static page generator can be incredibly easy! Create the following configuration file in the root of your project, install the used dependencies and run the `hoast` command to start a build.

```JavaScript
export default {
  options: {
    directory: 'src',
  },
  collections: [{
    source: ['@hoast/source-readfiles', {
      directory: 'pages',
    }],
    processes: [
      '@hoast/process-frontmatter',
      '@hoast/process-markdown',
      ['@hoast/process-handlebars', {
        templateDirectory: 'layouts',
        templatePath: 'default.hbs',
      }],
      ['@hoast/process-writefiles', {
        directory: '../dst',
      }],
    ],
  }],
}
```

> Configuration files can have many forms `JSON`, `JavaScript` objects, `Hoast` instances, or use the API directly and call the process function to start building.

## Architecture

There is one core package that controls what and when the modules are run as well as the data provided to them. What modules should run in what order can be controlled using a configuration file or directly through code.

This repository contains the core package as well as first party modules and everything directly surrounding the project. For example all the packages can be found in `packages` directory, the website's source code can be found in the `.docs` directory and the build of the website is in the `docs` directory.

## Made with

The following list are project that are build with this project.

- [hoast.js.org](https://hoast.js.org/) ([source](https://github.com/hoast/hoast/tree/main/.docs)) - The Hoast website itself.
- [doars.js.org](https://doars.js.org/) ([source](https://github.com/doars/doars/tree/main/.docs)) - The Doars website. Doars is a front-end library for declaring functionality in your markup.
- [rondekker.nl](https://rondekker.nl/en-gb/) - My personal website and blog.

The following list serve as tools you can use directly, or as an example on how to make a solution that fits your needs.

- [`examples`](/examples#readme) - Examples on how Hoast and several modules can be used.

## Packages

- [`hoast`](/packages/hoast#readme) - The core package of hoast responsible for managing and running the other packages. See this package for more information on how to create a config file.

### Source packages

- [`source-custom`](/packages/source-custom#readme) - Allows you to provide your own custom source functions. Extends base-source where the overridable functions can be provided via the options. Helps you from having to create a package for simple one-off behaviour.
- [`source-airtable`](/packages/source-airtable#readme) - Read data from Airtable bases.
- [`source-javascript`](/packages/source-javascript#readme) - Read and execute script from the filesystem.
- [`source-readfiles`](/packages/source-readfiles#readme) - Read files from the filesystem.

### Process packages

- [`process-custom`](/packages/process-custom#readme) - Allows you to provide your own custom process functions. Extends base-process where the overridable functions can be provided via the options. Helps you from having to create a package for simple one-off behaviour.
- [`process-frontmatter`](/packages/process-frontmatter#readme) - Extract frontmatter from a text value.
- [`process-handlebars`](/packages/process-handlebars#readme) - Template using [Handlebars](https://github.com/handlebars-lang/handlebars.js#readme).
- [`process-javascript`](/packages/process-javascript#readme) - Retrieve and execute JavaScript.
- [`process-log`](/packages/process-log#readme) - Log data to the terminal, useful for developing other process and source packages.
- [`process-markdown`](/packages/process-markdown#readme) - Convert markdown to HTML using [Unified](https://github.com/unifiedjs/unified#readme).
- [`process-parse`](/packages/process-parse#readme) - Parse a text value using a function or package.
- [`process-pdf`](/packages/process-pdf#readme) - Converts HTML to PDF using [puppeteer](https://github.com/puppeteer/puppeteer#readme).
- [`process-postprocess`](/packages/process-postprocess#readme) - Process CSS, HTML, and JS data using PostCSS, Unified's rehype, and Babel plugins and minify using CleanCSS, Unified's rehype, and Terser.
- [`process-writefiles`](/packages/process-writefiles#readme) - Write data to the filesystem.

### Developer packages

- [`base-package`](/packages/base-package#readme) - Provides basic functionality like receiving the library's reference and setting up a logger.
- [`base-process`](/packages/base-process#readme) - Provides basic functionality for process package like an initialization function, sequentially running of certain code, and filtering out running the process based of the data.
- [`base-source`](/packages/base-source#readme) - Provides basic functionality for source package like an initialization function, sequentially running of certain code, and a finallize function called after the source is done iterating.
- [`utils`](/packages/utils#readme) - A package of utility functions used by several other packages in this list.

## Ideas

- SQLite source plugin.
