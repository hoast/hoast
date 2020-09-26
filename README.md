<div align="center">

  [![](icons/128.png)](https://hoast.js.org)

  [![License agreement](https://img.shields.io/github/license/hoast/hoast.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast/blob/master/LICENSE)
  [![Open issues on GitHub](https://img.shields.io/github/issues/hoast/hoast.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast/issues)

</div>

# Hoast

## Elevator pitch

Creating a static page generator can be incredibly easy as is show below.

```JavaScript
import Hoast from '@hoast/hoast'
import ProcessFrontmatter from '@hoast/process-frontmatter'
import ProcessHandlebars from '@hoast/process-handlebars'
import ProcessMarkdown from '@hoast/process-markdown'
import ProcessPostprocess from '@hoast/process-postprocess'
import ProcessWritefiles from '@hoast/process-writefiles'
import SourceReadfiles from '@hoast/source-readfiles'

new Hoast()
  // Add a collection.
  .addCollection({
    // Get data from the filesystem.
    source: new SourceReadfiles({
      directory: 'src/pages',
    }),
    processes: [
      // Extract frontmatter.
      new ProcessFrontmatter(),
      // Parse markdown.
      new ProcessMarkdown(),
      // Template using handlebars.
      new ProcessHandlebars({
        templateDirectory: 'src/layouts',
        templatePath: 'default.hbs',
      }),
      // Minify results.
      new ProcessPostprocess(),
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



### Repository

1. Is monorepository. See packages directory for packages.

## Packages

### Core

- [`hoast`]()
- [`utils`]()

### Base packages

Packages used by process or source packages.

- [`base-package`]()
- [`base-process`]()
- [`base-source`]()

### Source packages

- [`source-custom`]() - Allows you to provide your own custom source methods. Extends base-source where the overridabel methods can be provided via the options. Helps you from having to create a package for simple one-off behaviour.
- [`source-readfiles`]()

### Process packages

- [`process-custom`]() - Allows you to provide your own custom process methods. Extends base-process where the overridabel methods can be provided via the options. Helps you from having to create a package for simple one-off behaviour.
- [`process-frontmatter`]()
- [`process-handlebars`]()
- [`process-log`]()
- [`process-markdown`]()
- [`process-mithril`]()
- [`process-parse`]()
- [`process-postprocess`]()
- [`process-writefiles`]()

### Made with

These serve as tools you can use directly, or as an example on how to make a solution that fits your needs.

- [`examples`]()
- [`hoastig`]()

### Ideas

Not yet made packages but ideas that might spark your imagination.

- `process-query` - Extract and process queries from the given data. Perhaps via GrapQL or other external apis.
- `process-<template-language>` - More template language packages are always welcome as everyone has a favourite or is already using one in a project they want to migrate over.
- `source-graphql` - Retrieve data via GraphQL queries.
- `source-rest` - Retrieve data via restful calls.

> If you want to create one of these packages do let me know by creating an issue. I would love to help you out where I can.

## Version numbering



## Contribute

The project uses yarn which has some support for monorepositories. To read more about how to run commands with yarn in a monorepository see the [yarn workspaces documentation](https://yarnpkg.com/features/workspaces) or run `% yarn workspaces -h`
