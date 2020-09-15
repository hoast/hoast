// Import base class.
import BaseProcessor from '@hoast/base-processor'
// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
// Import external modules.
import handlebars from 'handlebars'

// Promisfy read file.
const fsReadFile = promisify(fs.readFile)

class ProcessHandlebars extends BaseProcessor {
  constructor(options) {
    super({
      directory: null,

      template: null,
      templateField: null,
    }, options)

    if (!this._options.template && !this._options.templateField) {
      this._deugger.error('No template specified. Use the "template" or "templateField" options.')
    }

    // Convert dot notation to path segments.
    if (this._options.field) {
      this._fieldPath = this._options.field.split('.')
    }

    // Construct absolute directory path.
    this._directoryPath =
      (this._options.directory && path.isAbsolute(this._options.directory))
        ? this._options.directory
        : path.resolve(process.cwd(), this._options.directory)
  }

  async setup () {
    this._templateCache = {}

    if (this._options.template) {
      this._template = await fsReadFile(path.resolve(this._directoryPath, this._options.template), {
        encoding: 'utf8',
      })
      // Compile template.
      this._template = handlebars.compile(this._template)

      // Store template in cache.
      this._templateCache[this._options.template] = this._template
    }
  }

  async _getTemplate (templatePath) {
    // Construct absolute template path.
    templatePath =
      path.isAbsolute(templatePath)
        ? templatePath
        : path.resolve(this._options.directory, templatePath)

    // Check if it exists in cache.
    if (this._templateCache[templatePath]) {
      return this._templateCache[templatePath]
    }

    // Get template from filesystem.
    this._template = await fsReadFile(templatePath, {
      encoding: 'utf8',
    })

    // Compile template.
    this._template = handlebars.compile(this._template)

    // Store template in cache.
    this._templateCache[templatePath] = this._template

    return this._template
  }

  process (app, data) {
    // TODO:
    // Check for Get template
  }

  final () {
    // TODO: Clear cache.
  }
}

export default ProcessHandlebars
