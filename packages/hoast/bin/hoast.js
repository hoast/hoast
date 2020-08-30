#!/usr/bin/env node

// Node modules.
import fs from 'fs-extra'
import path from 'path'

// External libraries.
import minimist from 'minimist'

// Custom modules.
import Hoast from '../src/Hoast.js';

(async function() {
  // Construct command line interface.
  const options = minimist(process.argv.slice(2))

  // Display help.
  if (options.help) {
    return
  }

  // Set default configuration.
  const config = {}

  // ...

  const hoast = new Hoast()
}())
