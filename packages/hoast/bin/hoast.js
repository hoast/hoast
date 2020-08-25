#!/usr/bin/env node

// Node modules.
const fs = require('fs')
const path = require('path')
// If debug available require it.
let debug; try { debug = require('debug')('hoast-cli') } catch (error) { debug = function() { } }
// Dependency modules.
const commander = require('commander') // TODO: Switch to `optionator`.
// Custom modules.
const info = require('../package.json')
const Hoast = require('../library')

// Trace unhandled rejections.
process.on('unhandledRejection', function(reason, promise) {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})

// Setup command utility.
commander
  .name(info.name)
  .description(info.description)
  .version(info.version)
  .option('-c, --config <path>', 'path to configuration file', info.name.concat('.json'))
  .parse(process.argv)

// If version or help called do process.
if (commander.version !== true && commander.help !== true) {
  console.log('Start building...')
  let time = process.hrtime()

  // Translate arguments.
  const directory = process.cwd()
  const filePath = path.resolve(directory, commander.config)
  debug(`Process from ${filePath} configuration.`)
  // Check file access.
  fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK, function(error) {
    if (error) {
      throw error
    }
    debug('Configuration accessible.')

    // Read file.
    fs.readFile(filePath, async function(error, data) {
      if (error) {
        throw error
      }
      debug(`Configuration read: ${data}`)

      // Parse file content to JSON.
      const config = JSON.parse(data)

      // Initialize hoast.
      const hoast = Hoast(directory, config.options)

      debug('Start adding modules.')
      // Modules cache.
      const moduleCache = {
        // Already add in any build-in modules.
        read: Hoast.read,
      }
      // Add all modules.
      if (Array.isArray(config.modules)) {
        for (let i = 0; i < config.modules.length; i++) {
          await addModule(directory, hoast, moduleCache, config.modules[i])
        }
      } else if (typeof (config.modules) === 'object') {
        await addModule(directory, hoast, moduleCache, config.modules)
      } else {
        throw new Error('Modules configuration must be of type object or array.')
      }
      debug('Finished adding modules.')

      // Process.
      await hoast.process()

      time = process.hrtime(time)
      console.log('\x1b[47m\x1b[30m', `Finished in ${(time[0] + time[1] / 1e9).toFixed(3)}s.`, '\x1b[0m')
    })
  })

  const addModule = async function(directory, hoast, moduleCache, moduleConfig) {
    for (const name in moduleConfig) {
      if (!Object.prototype.hasOwnProperty.call(moduleConfig, name)) {
        continue
      }

      // If module not already loaded.
      if (!moduleCache[name]) {
        // Get module path.
        const modulePath = await getModulePath(directory, name)
        if (!modulePath) {
          throw new Error(`Unable to find path to module: '${name}'.`)
        }
        // Require module.
        moduleCache[name] = require(modulePath)
      }
      // Add module to stack.
      hoast.use(moduleCache[name](moduleConfig[name]))
      debug(`Added '${name}' module.`)
    }
  }

  /**
   * Tries to retrieve the path to the module of that name.
   * @param {string} directory The working directory.
   * @param {string} moduleName Name of the module.
   */
  const getModulePath = async function(directory, moduleName) {
    // Create all possible paths.
    const modulePaths = [
      path.resolve(directory, 'node_modules', moduleName),
      path.resolve(directory, moduleName),
      path.resolve(directory, moduleName).concat('.js'),
      moduleName,
      moduleName.concat('.js'),
    ]

    // Check the access to each path to find the right one.
    while (modulePaths.length > 0) {
      const modulePath = modulePaths.pop()
      const result = await checkPathAccess(modulePath)
      // If result is positive return that path.
      if (result) {
        return modulePath
      }
    }

    // If still not found then exit with an error.
    return `Unable to find the '${moduleName}' module.`
  }

  const checkPathAccess = function(filePath) {
    return new Promise(function(resolve) {
      fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK, function(error) {
        if (error) {
          // If not found return false.
          return resolve(false)
        }
        // If found return path.
        resolve(true)
      })
    })
  }
}
