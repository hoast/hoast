<div align="center">
  
  [![](icons/128.png)](https://hoast.github.io)
  
  [![npm package @latest](https://img.shields.io/npm/v/hoast.svg?label=npm@latest&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast)
  [![npm package @next](https://img.shields.io/npm/v/hoast/next.svg?label=npm@next&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast/v/next)
  
  [![Travis-ci status](https://img.shields.io/travis-ci/hoast/hoast.svg?branch=master&label=test%20status&style=flat-square&maxAge=3600)](https://travis-ci.org/hoast/hoast)
  [![CodeCov coverage](https://img.shields.io/codecov/c/github/hoast/hoast/master.svg?label=test%20coverage&style=flat-square&maxAge=3600)](https://codecov.io/gh/hoast/hoast)
  
  [![License agreement](https://img.shields.io/github/license/hoast/hoast.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast/blob/master/LICENSE)
  [![Open issues on GitHub](https://img.shields.io/github/issues/hoast/hoast.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast/issues)
  
</div>

# hoast

A modular file processor focused on creating a simple ecosystem for task automation.

## Elevator pitch

Creating a static page generator can be incredibly easy as is show below.

```JavaScript
const Hoast = require(`hoast`);
const read = Hoast.read,
      frontmatter = require(`hoast-frontmatter`),
      layout = require(`hoast-layout`),
      transform = require(`hoast-transform`);

Hoast(__dirname, {
  pattern: [
    `*`,
    `!(layouts/*)`
  ],
  patternOptions: {
    all: true,
    extended: true
  }
})
  // Read file content.
  .use(read())
  // Extract front matter.
  .use(frontmatter())
  // Transform markdown.
  .use(transform({
    patterns: `*.md`
  }))
  // Layout files.
  .use(layout({
    directory: `layouts`,
    layout: `page.hbs`,
    patterns: `*.html`
  }))
  // Process.
  .process();
```

> See the [static page generator example](https://github.com/hoast/hoast/blob/master/examples/static-page-generator) for the full example with in depth comments including dependencies and source directory.

## Table of contents

* [Introduction](#introduction)
* [Installation and usage](#installation-and-usage)
  * [Command line interface](#command-line-interface)
  * [Script](#script)
    * [API](#api)
    * [Asynchronously](#asynchronously)
  * [Debugging](#debugging)
* [Modules](#modules)
  * [Build-in](#build-in)
  * [Usage](#usage)
  * [Making](#making)
* [Known issues](#known-issues)
* [License](#license)

## Introduction

`hoast` is a modular file processor focused on creating a simple ecosystem for task automation. The original objective was to generate webpages using a minimal system, but in addition to static page generation it can also be used for a range of different applications.

The system has been written with several goals it mind, to be small in size as well as easy to use and improve. The result is a modular approach some of the advantages are:
1. An incredibly small base system, at just a few hundred lines of code and only three dependencies.
2. Highly customizable as modules are task specific therefore you only include the modules you want. This ensures you have a deeper understanding of the build process.
3. Modules are quick to create and allow a large portion of people to contribute.
4. Maintenance is easier as the code base is sectioned up and simpler to follow along to.

> Another key advantage is the environment the system has been developed in, Node.js, which utilizes JavaScript the language most commonly known by web developers who this project targets with static page generation.

The order in which hoast works can be broken down into three main steps.
1. From the source directory all files are scanned.
2. Each module manipulates the information presented.
3. The results are written to the destination directory.

> This tool has been inspired by [Metalsmith](https://github.com/segmentio/metalsmith#readme), the goal was to eliminate most of the dependencies and further modularise the system as well as improve readability of the code.

## Installation and usage

Install [hoast](https://npmjs.com/package/hoast) using [npm](https://npmjs.com) either locally to use the script version or globally to use the CLI tool.

```
$ npm install hoast
```

```
$ npm install -g hoast
```

### Command line interface

If you are more used to using a CLI you can do the following.

Install the global command:

```
$ npm install -g hoast
```

Create a JSON configuration file with the options and modules.

```JSON
{
  "options": {},
  "modules": {
    "read": {},
    "hoast-transform": {
      "patterns": "*.md"
    }
  }
}
```

If you want to re-use the same module multiple times you can wrap each module in their object and change the modules property in an array as seen below.

```JSON
{
  "options": {},
  "modules": [
    {
      "read": {},
    }, {
      "hoast-transform": {
        "patterns": "A/*.md"
      }
    }, {
      "hoast-transform": {
        "patterns": "B/*.md"
      }
    }
  ]
}
```

> Do not forget to install the modules as well.

Then run the help command for more information about running the CLI:

```
$ hoast -h
```

### Script

```JavaScript
// Include library.
const Hoast = require(`hoast`);
// Get build-in module.
const read = Hoast.read;

// Initialize hoast.
Hoast(__dirname)
  // Add module.
  .use(read())
  // Start process.
  .process();
```

**constructor(directory, options)**

As with any constructor it initializes the object.

Returns the `hoast` instance.

* `directory`: The working directory, most often `__dirname`.
  * Type: `String`
  * Required: `Yes`
* `options`: See [options](#options) for more detail about the parameter.
  * Type: `Object`
  * Required: `No`

**use(module)**

Adds the module to the modules stack.

Returns the `hoast` instance.

* `module`: See [using modules](#using) and [making modules](#making) for more detail about the parameter.
  * Type: `Function`
  * Required: `Yes`

**process(options)**

An asynchronous function which goes through the three steps mentioned in the introduction. It scans the files in the source directory, cycles through each module, and writes the result to the destination directory.

Returns the `hoast` instance.

* `options`: See [options](#options) for more detail about the parameter.
  * Type: `Object`
  * Required: `No`

**options**

The options object which can be given using the `constructor` or `process` functions.

* `source` The directory to process files from.
  * Type: `String`
  * Default: `source`
* `destination`: The directory to write the processed files to.
  * Type: `String`
  * Default: `destination`
* `remove`: Whether to remove all files in the destination directory before processing.
  * Type: `String`
  * Default: `false`
* `patterns`: Glob patterns to match directory and file paths with. If a path does not match during scanning of the source it will not be further explored.
  * Type: `String` or `Array of strings`
	* Default: `[]`
* `patternOptions`: Options for the glob pattern matching. See [planckmatch options](https://github.com/redkenrok/node-planckmatch#options) for more details on the pattern options.
  * Type: `Object`
  * Default: `{}`
* `patternOptions.all`: This options is added to `patternOptions`, and determines whether all patterns need to match instead of only one.
  * Type: `Boolean`
  * Default: `false`
* `concurrency`: Maximum number of files to process at once.
  * Type: `Number`
  * Default: `Infinity`
* `metadata`: Metadata that can be used by modules.
  * Type: `Object`
  * Default: `{}`

> The defaults are only applied when the constructor is called, the process' options parameter overrides what is set earlier.

### Asynchronously

hoast can be used asynchronously via script, two examples are given below.

```JavaScript
const Hoast = require(`hoast`);
const read = Hoast.read;

Hoast(__dirname)
  .use(read())
  .process()
  // On end.
  .then(function(hoast) {
    console.log(`Processing successfully finished!`);
  })
  // On error.
  .catch(function(error) {
    console.error(error);
  });
```

```JavaScript
const Hoast = require(`hoast`);
const read = Hoast.read;

const build = async function() {
  let hoast = Hoast(__dirname);
  try {
    await hoast
      .use(read())
      .process();
  }
  // On error.
  catch(error) {
    console.error(error);
  }
  // On end.
  console.log(`Processing successfully finished!`);
};

build();
```

> As you can see in both examples the hoast object is still available for further usage.

### Debugging

When making a hoast module I highly recommend activating the debug logs by setting up the environment variables as well as the [debug](https://github.com/visionmedia/debug#readme) module.

On Windows the environment variable is set using the `set` command.

```
set DEBUG=*,-not_this
```

Note that PowerShell uses different syntax to set environment variables.

```
$env:DEBUG = "*,-not_this"
```

## Modules

As mentioned before the modules handle the logic that transforms the file information into the desired result. They are chained one after another and fed the results of the module that came before it. At the start the only information available is provided by the scanner function which performs a recursive search of the source directory and returns an array with objects of which an example can be seen below.

```JavaScript
{
  path: `mark/down.md`,
  
  stats: {
    dev: 2114,
    ino: 48064969,
    mode: 33188,
    nlink: 1,
    uid: 85,
    gid: 100,
    rdev: 0,
    size: 527,
    blksize: 4096,
    blocks: 8,
    atimeMs: 1318289051000,
    mtimeMs: 1318289051000,
    ctimeMs: 1318289051000,
    birthtimeMs: 1532801006990
  }
}
```

> For more detail about [stats](https://nodejs.org/api/fs.html#fs_class_fs_stats) see the node documentation. The functions as well as the atime, mtime, ctime, and birthtime are not included.

### Build-in

There is a single build-in module which reads the content of the files. It adds a `content` property as either a string or buffer depending if it is utf-8 encoded.

```JavaScript
{
  content: {
    type: `string`,
    data: `Hello there.`
  }
}
```

```JavaScript
{
  content: {
    type: `Buffer`,
    data: [ 71, 101, 110, 101, 114, 97, 108, 32, 75, 101, 110, 111, 98, 105, 46 ]
  }
}
```

> This module has to be called before the process function or any module that expects the content property to be set.

### Usage

The following example copies only the markdown files from the `source` directory to the `destination` directory.

```JavaScript
const Hoast = require(`hoast`);
const read = Hoast.read,
      filter = require(`hoast-filter`);

Hoast(__dirname)
  // Filter to only include .md files.
  .use(filter({
    patterns: `*.md`
  }))
  .use(read())
  .process()
```

> In this example you can see why the read function is not done automatically beforehand. Since you can now eliminate items from being further processed using the [filter](https://github.com/hoast/hoast-filter#readme) module before the read call is made.

You can re-use the modules after you have called process as seen below. The following script will copy all files from the `sourceA` and `sourceB` directories into the default destination directory.

```JavaScript
const Hoast = require(`hoast`);
const read = Hoast.read;

Hoast(__dirname)
  // Read file content.
  .use(read())
  .process({
    source: `sourceA`
  })
  .then(function(hoast) {
    return hoast.process({
      source: `sourceB`
    });// Read will automatically be used again.
  });
```

If you want to start with a fresh set of modules all you have to do is remove out `hoast.modules` property. The following script first copies all markdown files from the default source directory to the destination directory, and then copies all text files from the same source directory to the destination directory.

```JavaScript
const Hoast = require(`hoast`);
const read = Hoast.read,
      filter = require(`hoast-filter`);

Hoast(__dirname)
  // Filter out everything but markdown files.
  .use(filter({
    patterns: `*.md`
  })) // Only .md files available afterwards.
  .use(read())
  .process()
  .then(function(hoast) {
    // Removing out modules array.
    hoast.modules = [];
    return hoast
      // Filter out everything but text files.
      .use(filter({
        patterns: `*.txt`
      })) // Only .txt files available afterwards.
      .use(read())
      .process();
  });
```

> See the [examples](https://github.com/hoast/hoast/tree/master/examples) directory for more in depth usage.

### Making

In the simplest form the script below is a hoast module. The first time it will be called as a function and arguments can be passed on so properties can be initialized or validated. The return of the function is another function which will be called every time files need to be processed. `hoast` is the hoast instance and has the options property assigned via the constructor or process call. The `files` argument is an array files scanned and ready to me transformed.

```JavaScript
module.exports = function(options) {
  // Prepare anything.
  
  // Return module.
  return function(hoast, files) {
    // Perform logic.
  };
};
```

> For future proving and compatibility with the command-line tool use a single options parameter in the exported function.

> See the [remove module](https://github.com/hoast/hoast-remove#readme) for an example.

The modules can also be asynchronously by either adding the [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) keyword or using a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```JavaScript
module.exports = function(options) {
  
  // Return asynchronous module.
  return async function(hoast, files) {
    // Perform asynchronous logic.
  };
};
```

You can also return a new files array if you need to overwrite the existing one, however it is recommended to iterate over the files using the forEach function instead of map or filter. Use this power carefully!

```JavaScript
module.exports = function(options) {
  
  return function(hoast, files) {
    
    // Override files.
    return files;
  };
};
```

> See the [filter module](https://github.com/hoast/hoast-filter#readme) for an example.

Some modules might require to be perform logic after all options are initialized or after all files are written to storage. To accommodate this you can add a `before` and `after` function to your main method. These functions can also be asynchronously and are called in the order the modules were added.

```JavaScript
module.exports = function(options) {
  
  const method = function(hoast, files) {
    // Perform logic across files.
  };
  
  method.before = function(hoast) {
    // Called before the files are scanned from storage.
  };
  
  method.after = function(hoast) {
    // Called after the files are written to storage.
  };
  
  // Return functions.
  return method.
};
```

> See the [changed module](https://github.com/hoast/hoast-changed#readme) for an example.

## Known issues

* Access modes of directories and files are not transferred.

## License

[ISC license](https://github.com/hoast/hoast/blob/master/LICENSE)