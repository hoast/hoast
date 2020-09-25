// Import base class.
import BaseProcess from '@hoast/base-process'

// Import build-in modules.
import path from 'path'

// Import utility modules.
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

// Import external modules.
import render from 'mithril-node-render'

class ProcessMythril extends BaseProcess {
  constructor(options) {
    super({
      property: 'content',

      componentDirectory: null,
      componentPath: null,
      componentProperty: null,
    }, options)

    if (!this._options.componentPath && !this._options.componentProperty) {
      this._logger.error('No component specified. Use the "componentPath" or "componentProperty" options.')
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
    const value = await render(component, {
      app: this._app,
      data: data,
    })

    // Set value.
    data = setByPathSegments(data, this._propertyPath, value)

    // Return result.
    return data
  }
}

export default ProcessMythril
