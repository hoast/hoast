// Import base class.
import BaseProcess from '@hoast/base-process'

// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import utility modules.
import iterateDirectory from '@hoast/utils/iterateDirectory.js'
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

// Import external modules.
import Handlebars from 'handlebars'

// Promisify read file.
const fsReadFile = promisify(fs.readFile)

class ProcessHandlebars extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      property: 'contents',

      // Template options.
      templateDirectory: null,
      templatePath: null,
      templateProperty: null,

      // Handlebars options.
      handlebarsOptions: {},
      helpers: null,
      helpersDirectory: null,
      partials: null,
      partialsDirectory: null,
    }, options)
    options = this.getOptions()

    if (!options.templatePath && !options.templateProperty) {
      this.getLogger().error('No template specified. Use the "templatePath" or "templateProperty" options.')
    }

    // Convert dot notation to path segments.
    this._propertyPath = options.property.split('.')
    if (options.templateProperty) {
      this._templatePropertyPath = options.templateProperty.split('.')
    }
  }

  async initialize () {
    const libraryOptions = this.getLibrary().getOptions()
    const options = this.getOptions()

    // Construct absolute directory path.
    this._templateDirectoryPath =
      (options.templateDirectory && path.isAbsolute(options.templateDirectory))
        ? options.templateDirectory
        : path.resolve(libraryOptions.directoryPath, options.templateDirectory)

    this._templates = {}

    if (options.templatePath) {
      // Construct absolute template path.
      const templatePathAbsolute =
        path.isAbsolute(options.templatePath)
          ? options.templatePath
          : path.resolve(this._templateDirectoryPath, options.templatePath)
      const template = await fsReadFile(templatePathAbsolute, {
        encoding: 'utf8',
      })

      if (!template) {
        this.getLogger().error('No template found at path: "' + options.templatePath + '"')
      } else {
        // Store compiled template in cache.
        this._templates[templatePathAbsolute] = Handlebars.compile(template, options.handlebarsOptions)
      }
    }

    if (options.helpersDirectory || options.partialsDirectory) {
      const promises = []

      // Get helpers from directory.
      if (options.helpersDirectory) {
        promises.push(
          (async () => {
            // Construct absolute helpers directory path.
            this._helpersPath =
              (options.helpersDirectory && path.isAbsolute(options.helpersDirectory))
                ? options.helpersDirectory
                : path.resolve(libraryOptions.directoryPath, options.helpersDirectory)

            // Get helper files.
            const directoryIterator = await iterateDirectory(this._helpersPath)

            let filePath
            // Get next file path.
            while (filePath = await directoryIterator()) {
              // Get relative file path.
              const filePathRelative = path.relative(this._helpersPath, filePath)

              // Dynamic import helper.
              let helper = await import(filePath)
              if (!helper || !helper.default) {
                continue
              }
              helper = helper.default

              // Register helper.
              Handlebars.registerHelper(filePathRelative, helper)
            }
          })()
        )
      }

      // Get partials from directory.
      if (options.partialsDirectory) {
        promises.push(
          (async () => {
            // Construct absolute helpers directory path.
            this._partialsPath =
              (options.partialsDirectory && path.isAbsolute(options.partialsDirectory))
                ? options.partialsDirectory
                : path.resolve(libraryOptions.directoryPath, options.partialsDirectory)

            // Get helper files.
            const directoryIterator = await iterateDirectory(this._partialsPath)

            let filePath
            // Get next file path.
            while (filePath = await directoryIterator()) {
              // Get relative file path.
              const filePathRelative = path.relative(this._partialsPath, filePath)

              // Get file content.
              const partial = await fsReadFile(filePath, { encoding: 'utf8' })

              // Register partial.
              Handlebars.registerPartial(filePathRelative, partial)
            }
          })()
        )
      }

      // Await directory promises.
      await Promise.all(promises)
    }

    // Register helpers.
    if (options.helpers) {
      for (const { name, helper } of options.helpers) {
        Handlebars.registerHelper(name, helper)
      }
    }

    // Register partials.
    if (options.partials) {
      for (const { name, partial } of options.partials) {
        Handlebars.registerPartial(name, partial)
      }
    }
  }

  async sequential (data) {
    const library = this.getLibrary()
    const options = this.getOptions()

    // Get template path.
    let templatePath
    if (this._templatePropertyPath) {
      templatePath = getByPathSegments(data, this._templatePropertyPath)
    }

    if (!templatePath && options.templatePath) {
      templatePath = options.templatePath
    } else {
      this.getLogger().warn('No template path found therefore skipping!')
      return data
    }

    // Construct absolute template path.
    const templatePathAbsolute =
      path.isAbsolute(templatePath)
        ? templatePath
        : path.resolve(this._templateDirectoryPath, templatePath)

    if (library.isWatching()) {
      library.addAccessed(data.sourceIdentifier, templatePathAbsolute)
    }

    // Get template.
    let template
    // Check if it exists in cache.
    if (this._templates[templatePathAbsolute]) {
      template = this._templates[templatePathAbsolute]
    } else {
      // Get template from filesystem.
      template = await fsReadFile(templatePathAbsolute, {
        encoding: 'utf8',
      })

      if (!template) {
        this.getLogger().warn('No template found at path "' + templatePath + '" therefore skipping!')
        return data
      }

      // Compile template.
      template = Handlebars.compile(template, options.handlebarsOptions)

      // Store template in cache.
      this._templates[templatePathAbsolute] = template
    }
    if (library.isWatching()) {
      if (this._helpersPath) {
        library.addAccessed(data.sourceIdentifier, path.join(this._helpersPath + '**'))
      }
      if (this._partialsPath) {
        library.addAccessed(data.sourceIdentifier, path.join(this._partialsPath + '**'))
      }
    }

    // Compile data with template and set value.
    data = setByPathSegments(data, this._propertyPath, template({
      hoast: library,
      data: data,
    }))

    // Return result.
    return data
  }

  final () {
    super.final()

    // Clear templates path and cache.
    this._helpersPath = null
    this._partialsPath = null
    this._templateDirectoryPath = null
    this._templates = null
  }
}

export default ProcessHandlebars
