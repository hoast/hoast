<div align="center">

  [![](../../icons/128.png)](https://hoast.js.org)

  [![npm package @latest](https://img.shields.io/npm/v/hoast.svg?label=npm@latest&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast)
  [![npm package @next](https://img.shields.io/npm/v/hoast/next.svg?label=npm@next&style=flat-square&maxAge=3600)](https://npmjs.com/package/hoast/v/next)

  [![Travis-ci status](https://img.shields.io/travis-ci/hoast/hoast.svg?branch=master&label=test%20status&style=flat-square&maxAge=3600)](https://travis-ci.org/hoast/hoast)
  [![CodeCov coverage](https://img.shields.io/codecov/c/github/hoast/hoast/master.svg?label=test%20coverage&style=flat-square&maxAge=3600)](https://codecov.io/gh/hoast/hoast)

  [![License agreement](https://img.shields.io/github/license/hoast/hoast.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast/blob/master/LICENSE)
  [![Open issues on GitHub](https://img.shields.io/github/issues/hoast/hoast.svg?style=flat-square&maxAge=86400)](https://github.com/hoast/hoast/issues)

</div>

# hoast

A modular data sourcer and transformer focused on creating a simple yet extendible ecosystem.

## Table of contents

* [Elevator pitch](#elevator-pitch)
* [Introduction](#introduction)
* [Installation](#installation)
* [Usage](#usage)
  * [Command line interface](#command-line-interface)
  * [Script](#script)
  * [Options](#options)
* [Source packages](#source-packages)
  * [Using](#usaging-source-packages)
  * [Making](#making-souce-packages)
* [Process packages](#process-packages)
  * [Using](#using-process-packages)
  * [Making](#making-process-packages)
* [Transform packages](#transform-packages)
  * [Using](#using-transform-packages)
  * [Making](#making-transform-packages)

## Elevator pitch

Creating a static page generator can be incredibly easy as shown below.

```JavaScript
import Hoast from '@hoast/hoast';
import SouceReadFiles from '@hoast/source-readfiles';
import ProcessWriteFiles from '@hoast/process-writefiles';

(new Hoast)
  .registerSource(
    'readfilesystem-markdown',
    new SouceReadFiles({
      patterns: [
        '*',
        '!(layouts)',
      ],
      patternOptions: {
        all: true,
        extended: true,
      },
    })
  )
  .registerProcess(
    'writefilesystem',
    new ProcessWriteFiles()
  )
```

> See the [static page generator example]() for the full example with in depth comments including dependencies and source directory.

## Introduction

TODO:

## Installation

```
% npm install hoast --save
```

OR

```
% yarn add hoast
```

## Usage

### Command line interface



### Script



### Options



### Configuration files



#### JSON



#### JavaScript object



#### JavaScript Instance



## Source packages

Source packages, as the name implies, source data to be transformed.

### Using source packages



### Making source packages



## Process packages

Process packages, as the name implies, process the sourced data.

### Using process packages



### Making process packages



## Transform packages

Transform packages, as the name implies, transform the data being processed. They serve the same purpose and interface as the process packages, but can also be dynamically infered using the [`@hoast/process-transform`]() package.

### Using transform packages



### Making transform packages



## Dev notes

### For source packages

Add a dot sperated namespace option to the options so the data returned can be easily merged with for instance the metadata object without weird quirks in the core code.

Source plugins should skip items if the item has not changes since last time. Except for metadata sourcing of course where the entire result will be cached and added to the metadata object if the source hasn't changed. Source plugins can keep track of this data in a cache directory perhaps managed by the app. Where they can possibly return a use cache property.
