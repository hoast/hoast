<div align="center">

  [![](_assets/128.png)](https://hoast.js.org)

  [![License agreement](https://img.shields.io/github/license/hoast/hoast.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast/blob/master/LICENSE)
  [![Open issues on GitHub](https://img.shields.io/github/issues/hoast/hoast.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast/issues)

</div>

# Hoast

## Elevator pitch

Creating a static page generator can be incredibly easy!

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

See the [packages directory](/packages) for a full list of first party packages in this repostory.

### Made with

These serve as tools you can use directly, or as an example on how to make a solution that fits your needs.

- [`examples`](/examples) - .

## Version numbering



## Contribute

The project uses yarn which has some support for monorepositories. To read more about how to run commands with yarn in a monorepository see the [yarn workspaces documentation](https://yarnpkg.com/features/workspaces) or run `% yarn workspaces -h`
