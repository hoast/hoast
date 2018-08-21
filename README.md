<div align="center">
  <a title="Version master branch" href="https://github.com/hoast/hoast#readme" target="_blank" rel="noopener">
    <img src="https://img.shields.io/github/package-json/v/hoast/hoast.svg?label=master&style=flat-square"/>
  </a>
  <a title="Version npm package" href="https://npmjs.com/package/hoast" target="_blank" rel="noopener">
    <img src="https://img.shields.io/npm/v/hoast.svg?label=npm&style=flat-square"/>
  </a>
  <a title="License agreement" href="https://github.com/hoast/hoast/blob/master/LICENSE" target="_blank" rel="noopener">
    <img src="https://img.shields.io/github/license/hoast/hoast.svg?style=flat-square"/>
  </a>
  <a title="Travis-ci build statis" href="https://travis-ci.org/hoast/hoast" target="_blank" rel="noopener">
    <img src="https://img.shields.io/travis-ci/hoast/hoast.svg?branch=master&style=flat-square"/>
  </a>
  <a title="Open issues on GitHub" href="https://github.com/hoast/hoast/issues" target="_blank" rel="noopener">
    <img src="https://img.shields.io/github/issues/hoast/hoast.svg?style=flat-square"/>
  </a>
</div>

# hoast

A modular file processer focused on creating a simple ecosystem.

## The elevator pitch

Creating a static page generator can be incredibly easy as is show below.

```JavaScript
const Hoast = require(`hoast`);
const read = Hoast.read,
      filter = require(`hoast-filter`),
      frontmatter = require(`hoast-frontmatter`),
      layout = require(`hoast-layout`),
      transform = require(`hoast-transform`);

Hoast(__dirname)
  // Exclude layouts.
  .use(filter({
    invert: true,
    pattern: `layouts/**`
  }))
  // Read file content.
  .use(read())
  // Extract frontmatter.
  .use(frontmatter())
  // Transform markdown.
  .use(transform({
    patterns: `**/*.md`
  }))
  // Layout files.
  .use(layout({
    directory: `layouts`,
    layout: `page.hbs`,
    patterns: `**/*.html`
  }))
  // Process.
  .process();
```

> See the [static page generator example](https://github.com/hoast/hoast/blob/master/examples/static-page-generator) for the full example including dependencies and source directory.

## Introduction
Hoast is a modular file processer focused on creating a simple ecosystem. The original objective was to generate webpages using a minimal system, but in addition to static page generation it can also be used for a range of different applications.

The system has been written with several goals it mind, to be small in size as well as easy to use and improve. The result is a modular approach some of the advantages are:
1. An incredibly small base system, at just a few hundred lines of code and only two dependencies.
2. Highly customizable as modules are task specific therefore you only include the modules you want. This ensures you have a deeper understanding of the build process.
3. Modules are quick to create and allow a large portion of people to contribute.
4. Maintenance is easier as the code base is sectioned up and simpler to follow along to.

> Another key advantage is the environment the system has been developed in, Node.js, which utilises JavaScript the language most commonly known by web developers who this project targets with static page generation.

The order in which hoast works can be broken down into three main steps.
1. From the source directory all files are scanned.
2. Each module manipulates the information presented.
3. The results are written to the destination directory.

> This tool has been inspired by [Metalsmith](https://github.com/segmentio/metalsmith#readme), the goal was to eliminate most of the dependencies and further modularize the system as well as improve readability of the code.

## Installation

Install [hoast](https://npmjs.com/package/hoast) using [npm](https://npmjs.com) either locally to use the script version or globally to use the CLI tool.

```
$ npm install hoast
```

```
$ npm install -g hoast
```

## Usage

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
      "patterns": "**/*.md"
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

> Do not forget to install the modules themself as well.

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

// Initialize Hoast.
Hoast(__dirname)
  // Add module.
  .use(read())
  // Start process.
  .process();
```

#### constructor
As with any constructor it initializes the object.

* `directory` **{String}**: The working directory, most often `__dirname`.
* `options` **{Object}**: See [options](#options) for more detail about the parameter.

#### use
Adds the module to the modules stack.

* `module` **{Function}**: See [using modules](#using) and [making modules](#making) for more detail about the parameter.

#### process
An asynchronous function which goes through the three steps mentioned in the introduction. It scans the files in the source directory, cycles through each module, and writes the result to the destination directory.

* `options` **{Object}**: See [options](#options) for more detail about the parameter.

#### options

* `source` **{String}**: The directory to process files from.
	* Default: `source`.
* `destination` **{String}**: The directory to write the processed files to.
	* Default: `destination`.
* `remove` **{String}**: Whether to remove all files in the destination directory before processing.
  * Default: `false`.
* `concurrency` **{Number}**: Maximum number of files to process at once.
	* Default: `Infinity`.
* `metadata` **{Object}**: Metadata that can be used by modules.
	* Default: `{}`.

> The defaults are only applied when the constructor is called, the process` options parameter overrides what is set earlier.

#### Asynchronously
Hoast can be used asynchronously two examples are given below.

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
  path: `mark\\down.md`,
  
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

### Using
The following example copies only the markdown files from the `source` directory to the `destination` directory.

```JavaScript
const Hoast = require(`hoast`);
const read = Hoast.read,
      filter = require(`hoast-filter`);

Hoast(__dirname)
  // Filter to only include .md files.
  .use(filter({
    patterns: `**/*.md`
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
    });// Read will automaticly be used again.
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
    patterns: `**/*.md`
  })) // Only .md files available afterwards.
  .use(read())
  .process()
  .then(function(hoast) {
    // Removeing out modules array.
    hoast.modules = [];
    return hoast
      // Filter out everything but text files.
      .use(filter({
        patterns: `**/*.txt`
      })) // Only .txt files available afterwards.
      .use(read())
      .process();
  });
```

> See the [examples](https://github.com/hoast/hoast/tree/master/examples) directory for more in depth usage.

### Making
In the simplest form the script below is a hoast module. The first time it will be called as a function and arguments can be passed on so properties can be initialized or validated. The return of the function is another function which will be called every time files need to be processed. Hoast is the hoast instance and has the options property assigned during via the constructor or process call. The files argument is an array files scanned and ready to me transformed.

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
  
  // Return asynchronouse module.
  return async function(hoast, files) {
    // Perform asynchronouse logic.
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

### Browsing
* [Changed](https://github.com/hoast/hoast-changed#readme) - Filter out files which have not been changed since the last build.
* [Convert](https://github.com/hoast/hoast-convert#readme) - Convert the content of files using a specified function.
* [Filter](https://github.com/hoast/hoast-filter#readme) - Filter out files from further processing.
* [Frontmatter](https://github.com/hoast/hoast-frontmatter#readme) - Extracts frontmatter from files.
* [Layout](https://github.com/hoast/hoast-layout#readme) - Transform the content of files using layouts.
* [Rename](https://github.com/hoast/hoast-rename#readme) - Rename the path of files using a specified function.
* [Transform](https://github.com/hoast/hoast-transform#readme) - Transform the content of files based on the extension.

> Feel free to add modules yourself by making a [pull request to the repository](https://github.com/hoast/hoast/pulls).

## Planned

### Modules
1. `publish`, control publishing mode of a file using the frontmatter.
2. `livereload`, allow for live reloading.

## Known issues
* Access modes of directories and files are not transferred.