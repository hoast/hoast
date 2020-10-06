# @hoast/hoast

The core package of [hoast](https://hoast.js.org) responsible for managing and running the other packages.

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

#### Public variables

- `meta {Object}` Global metadata that can be picked up by process packages.
- `options {Object}` Options object.
