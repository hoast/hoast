<div align="center">

  ![Project logo](_docs/src/assets/icon-round-256.png)

</div>

# Hoast

A simple and modular ecosystem for build automation.

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



## Packages

See the [packages directory](/packages) for a full list of first party packages in this repostory.

### Made with

These serve as tools you can use directly, or as an example on how to make a solution that fits your needs.

- [`examples`](/examples) - A series of examples on how Hoast and several packages can be used.

## Version numbering

TODO:

## Contribute

Read the [code of conduct](/CODE_OF_CONDUCT.md) and [contributing](/CONTRIBUTING.md) documents to get up to speed on how to get involved.

## Tasklist

- Expand documentation.
- Expand examples.
- Improve logger use.
- Write tests.

### On release

- Setup GitHub actions to run tests.
- Setup GitHub actions to mirror releases between the NPM and GitHub registry.
