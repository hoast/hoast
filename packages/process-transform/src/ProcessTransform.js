// Import external modules.
import BasePackage from '@hoast/base-package'
import { getByPathSegments } from '@hoast/utils/get.js'
import instantiate from '@hoast/utils/instantiate.js'

// TODO:
// Perhaps do everything dynamically

class ProcessTransform extends BasePackage {
  constructor(options) {
    super({
      typesField: 'extensions',
      transformers: [],
    }, options)

    // Split field beforehand.
    this._typesFieldPath = this._options.field.split('.')
    this._transformerCache = {}
  }

  async next (app, data) {
    // Get transformer names.
    const types = getByPathSegments(data, this._typesFieldPath)
    for (const type of types) {
      // Get transformer.
      const transformer = this._getTransformerByType(type)
      // Skip if no transformer is found.
      if (!transformer) {
        this._logger.warn(`Unkown "type" of "${type}" therefore skipping it.`)
        continue
      }

      // Process data.
      data = await transformer.transform(app, data)

      // Stop if data is invalid.
      if (data === undefined || data === null) {
        break
      }
    }

    return data
  }

  _getTransformerByType (type) {
    for (const transformer of this._options.transformers) {
      if (Array.isArray(transformer.types)) {
        if (transformer.types.indexOf(type) >= 0) {
          return this._getTransformerByName(transformer.name, transformer.options)
        }
      } else if (transformer.types === type) {
        return this._getTransformerByName(transformer.name, transformer.options)
      }
    }

    return false
  }

  _getTransformerByName (name, parameters) {
    // Check cache.
    if (this._transformerCache[name]) {
      return this._transformerCache[name]
    }

    // Instantiate transformer by name.
    const transformer = instantiate(name, parameters)
    // Check if valid.
    if (!transformer) {
      return false
    }

    // Store in cache.
    this._transformerCache[name] = transformer

    // Return transformer.
    return transformer
  }
}

export default ProcessTransform
