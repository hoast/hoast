#!/usr/bin/env node

// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import { watch } from 'chokidar'
import deepAssign from '@hoast/utils/deepAssign.js'
import instantiate from '@hoast/utils/instantiate.js'
import minimist from 'minimist'

// Import local utility libraries.
// TODO: import { isValidConfig } from './util/isValid.js'
import timer from './utils/timer.js'

// Import core library.
import Hoast from '../Hoast.js'

// Promisify read file.
const fsAccess = promisify(fs.access)
const fsReadFile = promisify(fs.readFile)

const CLI = async function () {
  // Get package file.
  // 1. Take import url (aka file path of script).
  // 2. Remove file:// protocol using a regular expression.
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
        '../../package.json'
      ),
      'utf8'
    )
  )

  // Standard CLI messages.
  const MESSAGE_SEE_DOCS = `See '${pkg.docs}' for more information about hoast.`
  const MESSAGE_SEE_HELP = `Use '${pkg.name} help' to see a list of commands.`

  // Construct command line interface.
  const options = minimist(process.argv.slice(2))
  options._ = options._.map(_ => String.prototype.toLowerCase.call(_))

  if (options._.length > 0) {
    // Display help.
    if (options._.indexOf('h') >= 0 || options._.indexOf('help') >= 0) {
      console.log(`
ʕ ˵•ᴥ•ʔっ ${pkg.name} (v${pkg.version})

Usage
% ${pkg.name} [command] [...options]

Commands
  h, help     Display help
  r, run      Run from file (default command)
  v, version  Display version

Options for run
  --concurrency-limit  {Number}  Maximum amount of items to process at once. (Default: 4)
  --directory-path     {String}  Directory to run the command from. (Default: '.')
  --file-path          {String}  File path to config or script file. (Defaults: 'hoast.js' and 'hoast.json')
  --log-level          {Number}  Log level given to the logger. (Default: 2 (Errors and warnings))
  --watch                        Re-run automatically when a file changes.
  --watch-ignore       {String}  Glob or regular expression of paths to exclude. (Default: 'node_modules/**')
`)
      return
    }

    // Display version.
    if (options._.indexOf('v') >= 0 || options._.indexOf('version') >= 0) {
      console.log(`
ʕ ˵·ᴥ·ʔっ ${pkg.name} (v${pkg.version})
`)
      return
    }

    if (options._.indexOf('r') === -1 && options._.indexOf('run') === -1) {
      console.log(`ʕ ˵;ᴥ;ʔ Unknown command! ${MESSAGE_SEE_HELP}`)
      return
    }
  }

  // Log prepare message.
  console.log('ʕ ˵·ᴥ·ʔ   Preparing…')

  // Set base directory path.
  let directoryPath
  if (Object.prototype.hasOwnProperty.call(options, 'directory-path')) {
    directoryPath = options['directory-path']
    if (!path.isAbsolute(directoryPath)) {
      directoryPath = path.resolve(process.cwd(), directoryPath)
    }
  } else {
    directoryPath = process.cwd()
  }

  // Set configuration file path.
  let filePath
  if (Object.prototype.hasOwnProperty.call(options, 'file-path')) {
    filePath = options['file-path']
    if (!path.isAbsolute(filePath)) {
      filePath = path.resolve(directoryPath, filePath)
    }

    try {
      await fsAccess(filePath, fs.constants.R_OK)
    } catch {
      console.error(`Error: No readable configuration file found at "${filePath}". ` + MESSAGE_SEE_HELP)
      return
    }
  } else {
    // Check for hoast.js or hoast.json in current working directory.
    filePath = path.resolve(directoryPath, 'hoast.js')
    try {
      await fsAccess(filePath, fs.constants.R_OK)
    } catch {
      filePath = path.resolve(directoryPath, 'hoast.json')

      try {
        await fsAccess(filePath, fs.constants.R_OK)
      } catch {
        console.error(`Error: No readable configuration file found in "${directoryPath}". ` + MESSAGE_SEE_HELP)
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
      throw new Error('Unknown extension type! ' + MESSAGE_SEE_DOCS)
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
  hoast._options.directoryPath = directoryPath
  if (Object.prototype.hasOwnProperty.call(options, 'log-level')) {
    hoast._options.logLevel = options['log-level']
  }
  if (Object.prototype.hasOwnProperty.call(options, 'concurrency-limit')) {
    hoast._options.concurrencyLimit = options['concurrency-limit']
  }
  // Check if watch option is set.
  const isWatching = Object.prototype.hasOwnProperty.call(options, 'watch')
  hoast.setWatching(isWatching)

  let changedFiles, isProcessing
  // ChangedFiles is null since on the first process we want to perform a full rebuild.
  const doProcess = async function () {
    if (isProcessing) {
      return
    }

    // Mark as processing.
    isProcessing = true

    if (changedFiles && changedFiles.length > 0) {
      console.log(`
ʕ  ✦ᴥ✦ʔ   Processing changes…`)

      // Provide changed files to hoast and reset the local list.
      hoast.setChanged(changedFiles)
    }
    changedFiles = []

    // Start execution timer.
    const time = timer()

    // Start processing.
    await hoast.process() // TODO: If watching and an error is throw catch it and allow it to be rebuild on change, the program should not quit!

    // Log end with execution time.
    console.log(`ʕっ✦ᴥ✦ʔっ Done in ${time()}s!`)

    // Mark as done processing.
    isProcessing = false

    if (isWatching) {
      if (changedFiles && changedFiles.length > 0) {
        await doProcess()
      } else {
        // Log that the watcher is watching if no immediate process is started.
        console.log('ʕ ˵•ᴥ•ʔ   Watching for changes…')
      }
    }
  }

  if (isWatching) {
    let ignored = 'node_modules/**'
    if (Object.prototype.hasOwnProperty.call(options, 'watch-ignored')) {
      ignored = options['watch-ignored']
    }

    const handleFileChange = async function (filePath) {
      filePath = path.resolve(directoryPath, filePath)

      if (changedFiles.indexOf(filePath) < 0) {
        // Store change and check later.
        changedFiles.push(filePath)
      }

      if (!isProcessing && changedFiles.length > 0) {
        await doProcess()
      }
    }

    // Setup the watcher.
    watch(directoryPath, {
      cwd: directoryPath,
      disableGlobbing: true,
      ignored: ignored,
      ignoreInitial: true,
    })
      .on('add', handleFileChange)
      .on('change', handleFileChange)
      .on('unlink', handleFileChange)
  }

  // Log start message.
  console.log('ʕ ˵•ₒ•ʔ   Starting…')

  // Perform initial full build!
  await doProcess()
}

// Run CLI.
CLI()
