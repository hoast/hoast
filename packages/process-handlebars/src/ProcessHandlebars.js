// Import base class.
import BaseProcessor from '@hoast/base-processor'

// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import external modules.
import DirectoryIterator from '@hoast/utils/DirectoryIterator.js'
import Handlebars from 'handlebars'
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

// Promisfy read file.
const fsReadFile = promisify(fs.readFile)

class ProcessHandlebars extends BaseProcessor {
  constructor(options) {
    super({
      property: 'contents',
      handlebarsOptions: {},

      templateDirectory: null,
      templatePath: null,
      templateProperty: null,

      helpers: null,
      helpersDirectory: null,

      partials: null,
      partialsDirectory: null,
    }, options)

    if (!this._options.templatePath && !this._options.templateProperty) {
      this._logger.error('No template specified. Use the "template" or "templateProperty" options.')
    }

    // Construct absolute directory path.
    this._templateDirectoryPath =
      (this._options.templateDirectory && path.isAbsolute(this._options.templateDirectory))
        ? this._options.templateDirectory
        : path.resolve(process.cwd(), this._options.templateDirectory)

    // Convert dot notation to path segments.
    this._propertyPath = this._options.property.split('.')
    if (this._options.templateProperty) {
      this._templatePropertyPath = this._options.templateProperty.split('.')
    }
  }

  async initialize () {
    this._templates = {}

    if (this._options.templatePath) {
      // Construct absolute template path.
      const templatePathAbsolute =
        path.isAbsolute(this._options.templatePath)
          ? this._options.templatePath
          : path.resolve(this._options.templateDirectory, this._options.templatePath)
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
            const directoryPath =
              (this._options.helpersDirectory && path.isAbsolute(this._options.helpersDirectory))
                ? this._options.helpersDirectory
                : path.resolve(process.cwd(), this._options.helpersDirectory)

            // Get helper files.
            const directoryIterator = new DirectoryIterator(directoryPath)

            let filePath
            // Get next file path.
            while (filePath = await directoryIterator.next()) {
              // Get relative file path.
              const filePathRelative = path.relative(directoryPath, filePath)

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
            const directoryPath =
              (this._options.partialsDirectory && path.isAbsolute(this._options.partialsDirectory))
                ? this._options.partialsDirectory
                : path.resolve(process.cwd(), this._options.partialsDirectory)

            // Get helper files.
            const directoryIterator = new DirectoryIterator(directoryPath)

            let filePath
            // Get next file path.
            while (filePath = await directoryIterator.next()) {
              // Get relative file path.
              const filePathRelative = path.relative(directoryPath, filePath)

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
        : path.resolve(this._options.templateDirectory, templatePath)

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
        this._logger.warn('No template found at "' + templatePath + '" therefore skipping!')
        return data
      }

      // Compile template.
      template = Handlebars.compile(template, this._options.handlebarsOptions)

      // Store template in cache.
      this._templates[templatePathAbsolute] = template
    }

    if (!template) {
      this._logger.warn('No template found therefore skipping!')
      return data
    }

    // Compile data with template.
    data = setByPathSegments(data, this._propertyPath, template(data))

    return data
  }

  final () {
    // Clear templates cache.
    this._templates = undefined
  }
}

export default ProcessHandlebars
