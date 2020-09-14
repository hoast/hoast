#!/usr/bin/env node

// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import deepAssign from '@hoast/utils/deepAssign.js'
import instantiate from '@hoast/utils/instantiate.js'
import minimist from 'minimist'

// Import local utility libraries.
// TODO: import { isValidConfig } from './util/isValid.js'
import timer from './utils/timer.js'

// Import core library.
import Hoast from '../src/Hoast.js'

// Promisify read file.
const fsAccess = promisify(fs.access)
const fsReadFile = promisify(fs.readFile)

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

  const MESSAGE_VERSION = `ʕ ˵•ᴥ•ʔっ ${pkg.name} (v${pkg.version})`

  const MESSAGE_HELP = `
${MESSAGE_VERSION}

Usage
% ${pkg.name} [command] [options]

Commands
  h, help     Display help
  r, run      Run from file (default command)
  v, version  Display version

Options for run
  --log-level          {Number}  Log level of hoast itself (Default: 2)
  --file-path          {String}  File path to config or script file (Default: hoast.js THEN hoast.json)
  --ignore-cache       {Bool}    Whether to use the existing cache (Default: false)
  --concurrency-limit  {Number}  Maximum concurrency count (Default: 32)
`

  const MESSAGE_SEE_DOCS = `See '${pkg.docs}' for more information about hoast.`
  const MESSAGE_SEE_HELP = `Use '${pkg.name} help' to see a list of commands.`
  const MESSAGE_UNKNOWN_COMMAND = 'ʕ ˵;ᴥ;ʔ Unkown command!'

  // Construct command line interface.
  const options = minimist(process.argv.slice(2))
  options._ = options._.map(_ => String.prototype.toLowerCase.call(_))

  if (options._.length > 0) {
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

    if (options._.indexOf('r') === -1 && options._.indexOf('run') === -1) {
      console.log(`${MESSAGE_UNKNOWN_COMMAND} ${MESSAGE_SEE_HELP}`)
      return
    }
  }

  // Log prepare message.
  console.log('ʕ ˵·ᴥ·ʔ   Preparing!')

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
  let config
  let hoast
  switch (String.prototype.toLowerCase.call(extension)) {
    case '.json':
      // Read and parse configuration at file path.
      config = JSON.parse(await fsReadFile(filePath, 'utf8'))
      break

    case '.js':
      // Import from file path.
      let imported = await import(filePath)

      if (!imported || typeof (imported) !== 'object') {
        // Invalid response.
        throw new Error('Invalid configuration file content! ' + MESSAGE_SEE_HELP)
      }

      imported = imported.default

      if (imported && imported instanceof Hoast) {
        hoast = imported
        break
      }

      config = deepAssign({}, imported)
      break

    default:
      throw new Error('Unkown extension type! ' + MESSAGE_SEE_DOCS)
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
      for (const collection of config.metaCollections) {
        // Instantiate source.
        collection.source = await instantiate(collection.source)

        // Instantiate processes.
        for (let i = 0; i < collection.processes.length; i++) {
          collection.processes[i] = await instantiate(collection.processes[i])
        }

        // Add meta collection.
        hoast.addMetaCollection(collection)
      }
    }

    // Instantiate collection properties.
    for (const collection of config.collections) {
      // Instantiate source.
      collection.source = await instantiate(collection.source)

      // Instantiate processes.
      for (let i = 0; i < collection.processes.length; i++) {
        collection.processes[i] = await instantiate(collection.processes[i])
      }

      // Add collection.
      hoast.addCollection(collection)
    }

    if (config.processes) {
      // Instantiate processes.
      for (const name in config.processes) {
        if (Object.prototype.hasOwnProperty.call(config.processes, name)) {
          continue
        }

        // Register process.
        hoast.registerProcess(name, await instantiate(config.processes[name]))
      }
    }
  }

  // Overwrite options with CLI options.
  const optionsOverride = {}
  if (Object.prototype.hasOwnProperty.call(options, 'log-level')) {
    optionsOverride.logLevel = options['log-level']
  }
  if (Object.prototype.hasOwnProperty.call(options, 'ignore-cache')) {
    optionsOverride.ignoreCache = options['ignore-cache']
  }
  if (Object.prototype.hasOwnProperty.call(options, 'concurrency-limit')) {
    optionsOverride.concurrencyLimit = options['concurrency-limit']
  }
  // Manually overwrite options.
  hoast.options = deepAssign(
    hoast.options,
    optionsOverride
  )

  // Log start message.
  console.log('ʕ ˵•ₒ•ʔ   Starting!')

  // Start execution timer.
  const time = timer()

  // Start processing.
  await hoast.process()

  // Log end with execution time.
  console.log(`ʕっ•ᴥ•ʔっ Done in ${time()}s!`)
}

// Run CLI.
CLI()
