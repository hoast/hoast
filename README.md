<div align="center">

![Project logo](.docs/src/assets/icon-round-256.png)

</div>

# Hoast

A set of simple and modular packages for build automation.

## Elevator pitch

Creating a static page generator can be incredibly easy!

```JavaScript
import Hoast from '@hoast/hoast'
import ProcessFrontmatter from '@hoast/process-frontmatter'
import ProcessHandlebars from '@hoast/process-handlebars'
import ProcessMarkdown from '@hoast/process-markdown'
import ProcessWritefiles from '@hoast/process-writefiles'
import SourceReadfiles from '@hoast/source-readfiles'

new Hoast()
  // Add a collection.
  .addCollection({
    // Read data from the filesystem.
    source: new SourceReadfiles({
      directory: 'src/pages',
    }),
    processes: [
      // Extract frontmatter.
      new ProcessFrontmatter(),
      // Parse Markdown.
      new ProcessMarkdown(),
      // Template with Handlebars.
      new ProcessHandlebars({
        templateDirectory: 'src/layouts',
        templatePath: 'default.hbs',
      }),
      // Write data to the filesystem.
      new ProcessWritefiles({
        directory: 'dst',
      }),
    ],
  })
  // Start processing!
  .process()
```

## Architecture

The package is build up like most modular build tools these days. There is one core package that controls what and when the modules ran as well as the data provided to them. What modules should run in what order can be controlled using a configuration file or directly through code.

This repository contains the core package as well as first party modules and everything directly surrounding the project. For example all the packages can be found in `packages` directory, the website's source code can be found in the `.docs` directory and the build of the website is in the `docs` directory.

## Made with

The following list serve as tools you can use directly, or as an example on how to make a solution that fits your needs.

- [`.docs`](/.docs#readme) - The website's source code, which is of course build with this project.
- [`examples`](/examples#readme) - Examples on how Hoast and several modules can be used.

The following list are project that are build with this project.

- [`docs`](hoast.js.org) - The project's website is of course build using the project itself.

## Packages

- [`hoast`](/packages/hoast#readme) - The core package of hoast responsible for managing and running the other packages. See this package for more information on how to create a config file.

### Source packages

- [`source-custom`](/packages/source-custom#readme) - Allows you to provide your own custom source functions. Extends base-source where the overridabel functions can be provided via the options. Helps you from having to create a package for simple one-off behaviour.
- [`source-readfiles`](/packages/source-readfiles#readme) - Read files from the filesystem.

### Process packages

- [`process-custom`](/packages/process-custom#readme) - Allows you to provide your own custom process functions. Extends base-process where the overridabel functions can be provided via the options. Helps you from having to create a package for simple one-off behaviour.
- [`process-frontmatter`](/packages/process-frontmatter#readme) - Extract frontmatter from a text value.
- [`process-handlebars`](/packages/process-handlebars#readme) - Template using [Handlebars](https://github.com/handlebars-lang/handlebars.js#readme).
- [`source-javascript`](/packages/source-javascript#readme) - Retrieve and or execute JavaScript.
- [`process-log`](/packages/process-log#readme) - Log data to the terminal, useful for developing other process and source packages.
- [`process-markdown`](/packages/process-markdown#readme) - Convert markdown to HTML using [Unified](https://github.com/unifiedjs/unified#readme).
- [`process-parse`](/packages/process-parse#readme) - Parse a text value using a function or package.
- [`process-pdf`](/packages/process-pdf#readme) - Converts HTML to PDF using [puppeteer](https://github.com/puppeteer/puppeteer#readme).
- [`process-postprocess`](/packages/process-postprocess#readme) - Process CSS, HTML, and JS data using Postcss and Babel plugins. Only minifies by default using cleancss, html-minifier-terser, and terser.
- [`process-writefiles`](/packages/process-writefiles#readme) - Write data to the filesystem.

### For developers

- [`base-package`](/packages/base-package#readme) - Provides basic functionality like receiving the library's reference and setting up a logger.
- [`base-process`](/packages/base-process#readme) - Provides basic functionality for process package like an initialization function, sequentially running of certain code, and filtering out running the process based of the data.
- [`base-source`](/packages/base-source#readme) - Provides basic functionality for source package like an initialization function, sequentially running of certain code, and a finallize function called after the source is done iterating.
- [`utils`](/packages/utils#readme) - A package of utility functions used by several other packages in this list.
