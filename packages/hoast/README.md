# Hoast

The core package of [hoast](https://hoast.js.org) responsible for managing and running the other packages.

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

## Install

```
% yarn add @hoast/hoast
```

OR

```
% npm install @hoast/hoast --save
```

## Usage

### Configuration file

See the [config example](https://github.com/hoast/hoast/tree/master/examples/config#readme) for more detail on how to configure and use the core package.

### Command line interface

Run `hoast help` or `hoast h` to see information on how to use command line interface.

```
Usage
% @hoast/hoast [command] [...options]

Commands
  h, help     Display help
  r, run      Run from file (default command)
  v, version  Display version

Options for run
  --log-level          {Number}  Log level given to the logger. (Default: 2 (Errors and warnings))
  --file-path          {String}  File path to config or script file. (Defaults: hoast.js and hoast.json)
  --concurrency-limit  {Number}  Maximum amount of items to process at once. (Default: 4)
```

### Code

- `constructor` Create `Hoast` instance.
  - `@params {Object} options` Options object which can contain the following keys.
    - `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/master/packages/utils#logger.js).
    - `{Number} concurrencyLimit = 4` Maximum amount of items to process at once.
  - `@params {Object} meta = {}` Global metadata that can be picked up by process packages.
  - `@returns {Object}` Hoast instance.

#### Variables

- `meta {Object}` Global metadata that can be picked up by process packages.
- `options {Object}` Options object.

#### Functions

- `addMetaCollection` Add collection to meta collections.
  - `@param {Object} collection` Collection to add.
  - `@returns {Object}` Hoast instance.

- `addMetaCollections` Add multiple collections to meta collections.
  - `@param {Array} collections` Collections to add.
  - `@returns {Object}` The hoast instance.

- `addCollection` Add collection to collections.
  - `@param {Object} collection` Collection to add.
  - `@returns {Object}` The hoast instance.

- `addCollections` Add multiple collections to collections.
  - `@param {Array} collections` Collections to add.
   - `@returns {Object}` The hoast instance.

- `registerProcess` - Register process.
  - `@param {String} name` Name of process.
  - `@param {Object} process` Process object.
  - `@returns {Object}` The hoast instance.

- `registerProcesses` Register multiple processes.
  - `@param {Object} processes` Process objects by name as key.
  - `@returns {Object}` The hoast instance.

- `async process` Process collections.
  - `@returns {Object}` The hoast instance.
