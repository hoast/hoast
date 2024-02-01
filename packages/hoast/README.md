# @hoast/hoast

The core package of [hoast](https://hoast.js.org) responsible for managing and running the other packages.

## Install

```
$ npm install @hoast/hoast
```

## Usage

### Configuration file

See the [config example](https://github.com/hoast/hoast/tree/main/examples/config#readme) for more detail on how to configure and use the core package.

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
  --concurrency-limit  {Number}  Maximum amount of items to process at once. (Default: 4)
  --directory-path     {String}  Directory to run the command from. (Default: '.')
  --file-path          {String}  File path to config or script file. (Defaults: 'hoast.js' and 'hoast.json')
  --log-level          {Number}  Log level given to the logger. (Default: 2 (Errors and warnings))
  --watch                        Re-build automatically when a file changes.
  --watch-ignore       {String}  Glob patter or paths to exclude from watching. (Default: 'node_modules/**')
```

### API

- `constructor` Create `Hoast` instance.
  - `@params {Object} options` Options object which can contain the following keys.
    - `{Number} logLevel = 2` Log level given to the [logger](https://github.com/hoast/hoast/tree/main/packages/utils#logger.js).
    - `{Number} concurrencyLimit = 4` Maximum amount of items to process at once.
    - `{String} directory = process.cwd()` Directory path to build from. Relative paths are resolved with `process.cwd()`.
  - `@params {Object} meta = {}` Global metadata that can be picked up by process packages.
  - `@returns {Object}` Hoast instance.

#### Variables

- `meta {Object}` Global metadata that can be picked up by process packages.

#### Functions

#### Collections

- `addCollection` Add collection to collections.
  - `@param {Object}` collection Collection to add.
  - `@returns {Object}` The hoast instance.
- `addCollections` Add multiple collections to collections.
  - `@param {Array} collections` Collections to add.
  - `@returns {Object}` The hoast instance.

#### Meta collections

- `addMetaCollection` Add collection to meta collections.
  - `@param {Object}` collection Collection to add.
  - `@returns {Object}` The hoast instance.
- `addMetaCollections` Add multiple collections to meta collections.
  - `@param {Array} collections` Collections to add.
  - `@returns {Object}` The hoast instance.

#### Processes

- `registerProcess` Register process.
  - `@param {String} name` Name of process.
  - `@param {Object} process` Process object.
  - `@returns {Object}` The hoast instance.
- `registerProcesses` Register multiple processes.
  - `@param {Object} processes` Process objects by name as key.
  - `@returns {Object}` The hoast instance.

#### Process

- `async process` Process collections.

##### Access

- `addAccessed` Mark a file as accessed by the given source, this will allow the watcher to rebuild effectively.
  - `@params {String} source` A unique identifier of the source.
  - `@params {String} ...filePaths` File paths accessed by the source.
- `clearAccessed` Clears information of file paths accessed by the given source.
  - `@params {String} source` A unique identifier of the source.

#### Changes

- `getChanged` Get the list of changed file since the last build.
  - `@returns {Array<String>}` List of absolute file paths.
- `hasChanged` Check whether any files that the source uses have changed.
  - `@params {String} source` A unique identifier of the source.
  - `@returns {Boolean}` Whether a file the source uses has changed.
- `setChanged` Marks the given set of file paths as changed files.
  - `@params {Array<String>} filePaths = null` A list of absolute file paths.

#### Options

- `getOptions` Get the options.
  - `@returns {Object}` The options.

#### Watching

- `isWatching` Get whether the watcher is running.
  - `@returns {Boolean}` Whether the watcher is running.
- `setWatching` Set whether the watcher is running.
  - `@params {Boolean} isWatching` Whether the watcher is running.
