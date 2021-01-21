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

## Usage

See the [core package](/packages/hoast#readme) for

## Packages

See the [packages directory](/packages#readme) for the core package as well as a full list of first party modules.

### Made with

The following list serve as tools you can use directly, or as an example on how to make a solution that fits your needs.

- [`.docs`](/.docs#readme) - The website's source code, which is of course build with this project.
- [`examples`](/examples#readme) - Examples on how Hoast and several modules can be used.

The following list are project that are build with this project.

- [`docs`](hoast.js.org) - The project's website is of couse build using the project itself.

## Version numbering

The libraries follow sementic versioning meaning a version number follows the `MAJOR.MINOR.PATCH` format. Each segment is incrementend as follows:

- `MAJOR` version for backwards incompatible changes are made;
- `MINOR` version for functionality added in a backwards compatible manner;
- `PATCH` version for bug fixes made in a backwards compatible manner.

Do note each package has their own version number which requires their own minimum version of the core package. Keep this in mind when adding packages to your project. That being said the most recent version of everything should work fine.

## Contribute

Read the [code of conduct](/CODE_OF_CONDUCT.md) and [contributing](/CONTRIBUTING.md) documents to get up to speed on how to get involved.

## Tasklist

- Expand examples.
- Improve logs.
- Validate configs.
- Write tests.
- Reduce build.
