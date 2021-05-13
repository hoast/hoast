// Import base class.
import BaseProcess from '@hoast/base-process'

// Import build-in modules.
import path from 'path'

// Import utility modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

// Import external modules.
import render from 'mithril-node-render'

// Make Mithril renderer happy.
if (!global.window) {
  global.window = global.document = global.requestAnimationFrame = undefined
}

class ProcessMithril extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      property: 'contents',

      componentDirectory: null,
      componentPath: null,
      componentProperty: null,

      prefix: null,
      suffix: null,
    }, options)

    if (!this._options.componentPath && !this._options.componentProperty) {
      this._logger.error('No component specified. Use the "componentPath" or "componentProperty" options.')
    }
    // Convert dot notation to path segments.
    this._propertyPath = this._options.property.split('.')
    if (this._options.componentProperty) {
      this._componentPropertyPath = this._options.componentProperty.split('.')
    }
  }

  initialize () {
    // Construct absolute directory path.
    this._componentDirectoryPath =
      (this._options.componentDirectory && path.isAbsolute(this._options.componentDirectory))
        ? this._options.componentDirectory
        : path.resolve(this.getApp().options.directoryPath, this._options.componentDirectory)
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

    // Import component.
    let component = await import(componentPathAbsolute)
    if (!component) {
      this._logger.warn('No component found at path "' + componentPathAbsolute + '" therefore skipping!')
      return data
    }
    if (component.default) {
      component = component.default
    }

    // Compile data with component.
    let value = await render(component, {
      meta: this._app.meta,
      data: data,
    })
    if (this._options.prefix) {
      value = this._options.prefix + value
    }
    if (this._options.suffix) {
      value = value + this._options.suffix
    }

    // Set value.
    data = setByPathSegments(data, this._propertyPath, value)

    // Return result.
    return data
  }

  final () {
    super.final()

    this._componentDirectoryPath = null
  }
}

export default ProcessMithril
