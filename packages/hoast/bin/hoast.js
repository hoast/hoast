#!/usr/bin/env node

// Node modules.
import fs from 'fs'
import path from 'path'
import util from 'util'

// External libraries.
import minimist from 'minimist'

// Custom libraries.
import color from './util/color.js';
import instantiate from './util/instantiate.js';
import { isValidConfig } from './util/isValid.js'
import merge from '../src/util/merge.js'

// Import core library.
import Hoast from '../src/Hoast.js'

// Promisify read file.
const fsAccess = util.promisify(fs.access)
const fsReadFile = util.promisify(fs.readFile)

const CLI = async function () {
  // Get package file.
  // 1. Take import url (aka file path of script).
  // 2. Remove file:// protecol using a regular expression.
  // 3. Get directory path from file path.
  // 4. Resolve path to package file in parent directory.
  // 5. Get content of file at path.
  // 6. Parse file content as JSON.
  const pkg = JSON.parse(
    await fsReadFile(
      path.resolve(
        path.dirname(
          import.meta.url
            .replace(/(^\w+:|^)\/\//, '')
        ),
        '../package.json'
      ),
      'utf8'
    )
  )

  // Standard CLI messages.

  const MESSAGE_VERSION = `${pkg.name} (v${pkg.version})`

  const MESSAGE_HELP = `
${MESSAGE_VERSION}

Usage
% ${pkg.name} [command] [options]

Commands
  h, help     Display help
  r, run      Run from file (default command)
  v, version  Display version

Options for run
  --file-path          {String}  File path to config or script file (Default hoast.json / hoast.js)
  --ignore-cache       {Bool}    Whether to use the existing cache (Default: false)
  --limit-concurrency  {Number}  Maximum concurrency count (Default: 32)
`

  const MESSAGE_SEE_DOCS = `See '${pkg.docs}' for more information about hoast.`
  const MESSAGE_SEE_HELP = `Use '${pkg.name} help' to see a list of commands.`
  const MESSAGE_UNKNOWN_COMMAND = `Unkown command!`

  // Construct command line interface.
  const options = minimist(process.argv.slice(2))
  options._ = options._.map(_ => String.prototype.toLowerCase.call(_))

  // Display help.
  if (options._.indexOf('h') >= 0 || options._.indexOf('help') >= 0) {
    console.log(MESSAGE_HELP)
    return
  }

  // Display version.
  if (options._.indexOf('v') >= 0 || options._.indexOf('version') >= 0) {
    console.log(MESSAGE_VERSION)
    return
  }

  if (options._.length === 0 || options._.indexOf('r') >= 0 || options._.indexOf('run') >= 0) {
    // Set configuration file path.
    let filePath
    if (Object.prototype.hasOwnProperty.call(options, 'file-path')) {
      filePath = options['file-path']
      if (!path.isAbsolute(filePath)) {
        filePath = path.resolve(process.cwd(), filePath)
      }

      try {
        await fsAccess(filePath, fs.constants.R_OK)
      } catch {
        console.error(`Error: No readable configuration file found at "${filePath}". ` + MESSAGE_SEE_HELP)
        return
      }
    } else {
      // Check for hoast.js or hoast.json in current working directory.
      filePath = path.resolve(process.cwd(), 'hoast.js')
      try {
        await fsAccess(filePath, fs.constants.R_OK)
      } catch {
        filePath = path.resolve(process.cwd(), 'hoast.json')

        try {
          await fsAccess(filePath, fs.constants.R_OK)
        } catch {
          console.error(`Error: No readable configuration file found in "${process.cwd()}". ` + MESSAGE_SEE_HELP)
          return
        }
      }
    }

    const extension = path.extname(filePath)
    let config = {
      options: {},
      meta: {},
    }
    let hoast
    switch (String.prototype.toLowerCase.call(extension)) {
      case 'json':
        // Read and parse configuration at file path.
        config = merge(
          config,
          JSON.parse(
            fsReadFile(filePath, 'utf8')
          )
        )
        break

      case 'js':
        // Import from file path.
        const imported = await import(filePath)

        if (imported instanceof Hoast) {
          hoast = imported
          break
        }

        if (!imported || typeof (imported) !== 'object') {
          // Invalid response.
          throw new Error('Invalid configuration file content! ' + MESSAGE_SEE_HELP)
        }

        config = imported
        break
    }

    if (!hoast) {
      // Ensure options is set and an object.
      if (!config.options) {
        config.options = {}
      } else if (typeof (config.options) !== 'object') {
        throw new Error('Invalid options type in configuration file! Must be of type object. ' + MESSAGE_SEE_DOCS)
      }

      // Ensure meta is set and an object.
      if (!config.meta) {
        config.meta = {}
      } else if (typeof (config.meta) !== 'object') {
        throw new Error('Invalid meta type in configuration file! Must be of type object. ' + MESSAGE_SEE_DOCS)
      }

      // Setup hoast.
      hoast = new Hoast(config.options, config.meta)

      if (config.metaCollections) {
        // Instantiate meta collection properties.
        for (const collection in config.metaCollections) {
          // Instantiate source.
          collection.source = instantiate(collection.source)

          // Instantiate processes.
          for (const key in Object.keys(collection.processes)) {
            if (Object.prototype.hasOwnProperty.call(collection.processes, key)) {
              continue
            }
            collection.processes[key] = instantiate(collection.processes[key])
          }

          // Add meta collection.
          hoast.addMetaCollection(collection)
        }
      }

      // Instantiate collection properties.
      for (const collection in config.collections) {
        // Instantiate source.
        collection.source = instantiate(collection.source)

        // Instantiate processes.
        for (const key in Object.keys(collection.processes)) {
          if (Object.prototype.hasOwnProperty.call(collection.processes, key)) {
            continue
          }
          collection.processes[key] = instantiate(collection.processes[key])
        }

        // Add collection.
        hoast.addCollection(collection)
      }

      if (config.processes) {
        // Instantiate processes.
        for (const key in Object.keys(config.processes)) {
          if (Object.prototype.hasOwnProperty.call(config.processes, key)) {
            continue
          }

          // Register process.
          hoast.registerProcess(key, instantiate(config.processes[key]))
        }
      }
    }

    // Overwrite options with CLI options.
    const optionsOverride = {}
    if (Object.prototype.hasOwnProperty.call(options, 'ignore-cache')) {
      optionsOverride.ignoreCache = options['ignore-cache']
    }
    if (Object.prototype.hasOwnProperty.call(options, 'limit-concurrency')) {
      optionsOverride.concurrencyLimit = options['limit-concurrency']
    }
    hoast.setOptions(optionsOverride)

    // Start processing.
    hoast.process()
  }
}

// Run CLI.
CLI()
