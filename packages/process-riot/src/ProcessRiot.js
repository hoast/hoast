// Import base class.
import BaseProcessor from '@hoast/base-processor'

// Import build-in modules.
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

// Import local modules.
import executeCode from './utils/executeCode.js'

// Import external modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

// Import external riot modules.
import renderer from '@riotjs/ssr'
import compiler from '@riotjs/compiler'

// Promisfy read file.
const fsReadFile = promisify(fs.readFile)

class ProcessRiot extends BaseProcessor {
  constructor(options) {
    super({
      property: 'contents',
      riotOptions: {
        async: false,
        root: false,
      },

      componentDirectory: null,
      componentPath: null,
      componentProperty: null,
    }, options)

    if (!this._options.componentPath && !this._options.componentProperty) {
      this._logger.error('No component specified. Use the "component" or "componentProperty" options.')
    }

    // Construct absolute directory path.
    this._componentDirectoryPath =
      (this._options.componentDirectory && path.isAbsolute(this._options.componentDirectory))
        ? this._options.componentDirectory
        : path.resolve(process.cwd(), this._options.componentDirectory)

    // Convert dot notation to path segments.
    this._propertyPath = this._options.property.split('.')
    if (this._options.componentProperty) {
      this._componentPropertyPath = this._options.componentProperty.split('.')
    }
  }

  initialize () {
    // this._unregister = register()
  }

  async concurrent (data) {
    // Get component path.
    let componentPath
    if (this._componentPropertyPath) {
      componentPath = getByPathSegments(data, this._componentPropertyPath)
    }

    if (!componentPath && this._options.componentPath) {
      componentPath = this._options.componentPath
    } else {
      this._logger.warn('No component path found therefore skipping!')
      return data
    }

    // Construct absolute component path.
    const componentPathAbsolute =
      path.isAbsolute(componentPath)
        ? componentPath
        : path.resolve(this._options.componentDirectory, componentPath)

    // Get component name.
    let name = path.basename(componentPath, path.extname(componentPath))

    // Get component.
    let component = await fsReadFile(componentPathAbsolute, { encoding: 'utf8' })
    if (!component) {
      this._logger.warn('No component found at "' + componentPath + '" therefore skipping!')
      return data
    }
    // Compile component.
    component = compiler.compile(component, { file: name }).code
    // Turn code string into object.
    component = executeCode('return ' + component.substring(14))

    // If root force name to be 'html'.
    if (this._options.riotOptions.root) {
      name = 'html'
    }
    // Construct initialize component properties.
    const properties = {
      meta: this._app.meta,
      data: data,
    }

    // Render component.
    let result
    if (this._options.async) {
      result = await renderer.renderAsync(name, component, properties)
    } else {
      result = renderer.render(name, component, properties)
    }

    // Write result back to data at given property.
    data = setByPathSegments(data, this._propertyPath, result)

    return data
  }

  final () {
    // this._unregister()
  }
}

export default ProcessRiot
