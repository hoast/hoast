<div align="center">

  ![Project logo](_docs/src/assets/icon-round-256.png)

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

## Tasklist

- Expand documentation.
- Expand examples.
- Write tests.

### Known issues

- Not all items are iterated over and the final message `ʕっ✦ᴥ✦ʔっ Done in ${time()}s!` is not logged to the terminal.

### On release

- Setup GitHub actions to run tests.
- Setup GitHub actions to mirror releases between the NPM and GitHub registry.
