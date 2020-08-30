#!/usr/bin/env node

// Node modules.
import fs from 'fs'
import path from 'path'
import util from 'util'

// External libraries.
import minimist from 'minimist'

// Custom modules.
import { isClass } from '../src/util/is.js';
import merge from '../src/util/merge.js'
import Hoast from '../src/Hoast.js'

// Promisify read file.
const fsReadFile = util.promisify(fs.readFile)

const CLI = async function () {
  // Get package file.
  const pkg = JSON.parse(
    await fsReadFile(
      path.resolve('./package.json'),
      'utf8'
    )
  )

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
  --file-path          {String}  File path to config or script file
  --concurrency-limit  {Number}  Maximum concurrency count
`

  const MESSAGE_UNKNOWN_COMMAND = `Unkown command! Use '${pkg.name} help' to see a list of commands.`

  // Construct command line interface.
  const options = minimist(process.argv.slice(2))
  options._ = options._.map(_ => String.prototype.toLowerCase.call(_))

  console.log(JSON.stringify(options));

  // Display help.
  if (options._.indexOf('h') >= 0 || options._.indexOf('help') >= 0) {
    console.log(MESSAGE_HELP)
    return
  }

  if (options._.length === 0 || options._.indexOf('r') >= 0 || options._.indexOf('run') >= 0) {
    // Set configuration file path.
    let filePath = './hoast.json'
    if (Object.prototype.hasOwnProperty.call(options, 'file-path')) {
      filePath = options['file-path']
    }
    if (!path.isAbsolute(filePath)) {
      filePath = path.resolve(process.cwd(), filePath)
    }

    const extension = path.extname(filePath)
    let config = {
      options: {},
      meta: {},
    }
    let hoast;
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
          throw new Error('Invalid file!');
        }

        config = imported
        break
    }

    // Overwrite config options.
    if (Object.prototype.hasOwnProperty.call(options, 'concurrency-limit')) {
      config.options.concurrencyLimit = options['concurrency-limit']
    }

    if (!hoast) {
      // Setup hoast.
      hoast = new Hoast(config.options, config.meta)

      // Add processes.
      const processes = config.processes
      for (const key in Object.keys(processes)) {
        if (processes.hasOwnProperty(key)) {
          continue
        }
        const value = processes[key]

        let process, options
        if (Array.isArray()) {
          process = value.shift()
          options = value
        } else {
          process = value
          options = []
        }

        // Get type of process.
        let processType = typeof (process)

        // Check new value.
        if (processType !== 'function' && processType !== 'string' && extension === 'json') {
          throw new Error('Value of process should be of type string not object.');
        }

        // Import as package if string.
        if (typeof (process) === 'string') {
          process = await import(process)

          // Get type of imported.
          processType = typeof (process)

          // Check new value.
          if (processType !== 'function') {
            throw new Error('Imported value of process should be a class or function.');
          }
        }

        // Instantiate process.
        if (processType === 'function') {
          if (isClass(process)) {
            process = new process(...options)
          } else {
            process = process(...options)
          }
        }

        // Store back in processes.
        processes[key] = process
      }
      hoast.registerProcesses(
        processes
      )
    }

    // Overwrite options with config options.
    hoast.assignOptions(config.options)

    // Start processing.
    hoast.process()
  }

  // Display version.
  if (options._.indexOf('v') >= 0 || options._.indexOf('version') >= 0) {
    console.log(MESSAGE_VERSION)
    return
  }

  console.log(MESSAGE_UNKNOWN_COMMAND)
}

// Run CLI.
CLI()
