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

    if (!this._options.templatePath && !this._options.templateProperty) {
      this._logger.error('No template specified. Use the "templatePath" or "templateProperty" options.')
    }

    // Convert dot notation to path segments.
    this._propertyPath = this._options.property.split('.')
    if (this._options.templateProperty) {
      this._templatePropertyPath = this._options.templateProperty.split('.')
    }
  }

  async initialize () {
    // Construct absolute directory path.
    this._templateDirectoryPath =
      (this._options.templateDirectory && path.isAbsolute(this._options.templateDirectory))
        ? this._options.templateDirectory
        : path.resolve(this._app.options.directoryPath, this._options.templateDirectory)

    this._templates = {}

    if (this._options.templatePath) {
      // Construct absolute template path.
      const templatePathAbsolute =
        path.isAbsolute(this._options.templatePath)
          ? this._options.templatePath
          : path.resolve(this._templateDirectoryPath, this._options.templatePath)
      const template = await fsReadFile(templatePathAbsolute, {
        encoding: 'utf8',
      })

      if (!template) {
        this._logger.error('No template found at path: "' + this._options.templatePath + '"')
      } else {
        // Store compiled template in cache.
        this._templates[templatePathAbsolute] = Handlebars.compile(template, this._options.handlebarsOptions)
      }
    }

    if (this._options.helpersDirectory || this._options.partialsDirectory) {
      const promises = []

      // Get helpers from directory.
      if (this._options.helpersDirectory) {
        promises.push(
          (async () => {
            // Construct absolute helpers directory path.
            this._helpersPath =
              (this._options.helpersDirectory && path.isAbsolute(this._options.helpersDirectory))
                ? this._options.helpersDirectory
                : path.resolve(this._app.options.directoryPath, this._options.helpersDirectory)

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
      if (this._options.partialsDirectory) {
        promises.push(
          (async () => {
            // Construct absolute helpers directory path.
            this._partialsPath =
              (this._options.partialsDirectory && path.isAbsolute(this._options.partialsDirectory))
                ? this._options.partialsDirectory
                : path.resolve(this._app.options.directoryPath, this._options.partialsDirectory)

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
    if (this._options.helpers) {
      for (const { name, helper } of this._options.helpers) {
        Handlebars.registerHelper(name, helper)
      }
    }

    // Register partials.
    if (this._options.partials) {
      for (const { name, partial } of this._options.partials) {
        Handlebars.registerPartial(name, partial)
      }
    }
  }

  async sequential (data) {
    // Get template path.
    let templatePath
    if (this._templatePropertyPath) {
      templatePath = getByPathSegments(data, this._templatePropertyPath)
    }

    if (!templatePath && this._options.templatePath) {
      templatePath = this._options.templatePath
    } else {
      this._logger.warn('No template path found therefore skipping!')
      return data
    }

    // Construct absolute template path.
    const templatePathAbsolute =
      path.isAbsolute(templatePath)
        ? templatePath
        : path.resolve(this._templateDirectoryPath, templatePath)

    this._app.addAccessed(data.source, templatePathAbsolute)

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
        this._logger.warn('No template found at path "' + templatePath + '" therefore skipping!')
        return data
      }

      // Compile template.
      template = Handlebars.compile(template, this._options.handlebarsOptions)

      // Store template in cache.
      this._templates[templatePathAbsolute] = template
    }

    if (this._helpersPath) {
      this._app.addAccessed(data.source, path.join(this._helpersPath + '**'))
    }
    if (this._partialsPath) {
      this._app.addAccessed(data.source, path.join(this._partialsPath + '**'))
    }

    // Compile data with template and set value.
    data = setByPathSegments(data, this._propertyPath, template({
      app: this._app,
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
