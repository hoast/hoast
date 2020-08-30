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
* [Source modules](#source-modules)
  * [Using](#usaging-source-modules)
  * [Making](#making-souce-modules)
* [Process modules](#process-modules)
  * [Using](#using-process-modules)
  * [Making](#making-process-modules)
* [Transform modules](#transform-modules)
  * [Using](#using-transform-modules)
  * [Making](#making-transform-modules)

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

Install [hoast](https://npmjs.com/package/hoast) using [npm](https://npmjs.com) after you have your project initialized.

```
$ npm install hoast
```

OR

```
$ yarn add hoast
```

## Usage

### Command line interface



### Script



### Options



## Source modules

Source modules, as the name implies, source data to be transformed.

### Using source modules



### Making source modules



## Process modules

Process modules, as the name implies, process the sourced data.

### Using process modules



### Making process modules



## Transform modules

Transform modules, as the name implies, transform the data being processed.

### Using transform modules



### Making transform modules


