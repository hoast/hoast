// Import base class.
import BaseProcess from '@hoast/base-process'

// Import utility modules.
import deepAssign from '@hoast/utils/deepAssign.js'
import { getByPathSegments } from '@hoast/utils/get.js'
import instantiate from '@hoast/utils/instantiate.js'
import { setByPathSegments } from '@hoast/utils/set.js'

// import external modules.
import babel from '@babel/core'
import cssnano from 'cssnano'
import htmlMinifier from 'html-minifier-terser'
import { minify as terser } from 'terser'
import Postcss from 'postcss'

class ProcessPostprocess extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      property: 'contents',

      mode: 'html',
      modeProperty: null,
      modeArray: -1, // Index of value in array. Negative values get computed as "<array>.length - value".

      minify: true,

      cssMinifyOptions: {},
      cssOptions: {},
      cssPlugins: [],

      htmlMinifyOptions: {
        collapseWhitespace: true,
      },

      jsMinifyOptions: {},
      jsOptions: {},
    }, options)

    // Convert dot notation to path segments.
    this._propertyPath = this._options.property.split('.')
    if (this._options.modeProperty) {
      this._modePropertyPath = this._options.modeProperty.split('.')
    }
  }

  async initialize () {
    // Setup Postcss plugins.
    let cssPlugins = this._options.cssPlugins ?? []
    if (cssPlugins.length >= 0) {
      // Instantiate all plugins.
      const pluginsTemp = []
      for (let plugin of cssPlugins) {
        if (Array.isArray(plugin) || typeof (plugin) === 'string') {
          plugin = await instantiate(plugin)
        }
        pluginsTemp.push(plugin)
      }
      cssPlugins = pluginsTemp
    }

    // Add Postcss minifier.
    if (this._options.minify && this._options.cssMinifyOptions) {
      cssPlugins.push(cssnano(this._options.cssMinifyOptions))
    }

    // Setup Postcss.
    const postcss = new Postcss(cssPlugins)
    // Store options.
    const cssOptions = deepAssign({
    }, this._options.cssOptions, {
      from: undefined,
    })

    // Create CSS processor.
    this._cssProcess = (code) => {
      return postcss.process(code, cssOptions).css
    }
    this._cssProcessAsync = (code) => {
      return new Promise((resolve, reject) => {
        // Process via Postcss.
        postcss.process(code, cssOptions)
          .then(result => {
            resolve(result.css)
          })
          .catch(error => {
            reject(error)
          })
      })
    }

    // Store options.
    const jsOptions = deepAssign({}, this._options.jsOptions)
    const jsMinifyOptions = deepAssign({}, this._options.jsMinifyOptions)

    // Create JS processor.
    this._jsProcess = (code) => {
      // Process via Babel.
      const result = babel.transform(code, jsOptions)
      if (result.error) {
        return code
      }

      return result.code
    }
    this._jsProcessAsync = async (code) => {
      // Process via Babel.
      let result = await babel.transformAsync(code, jsOptions)
      if (result.error) {
        return code
      }

      code = result.code

      // Process via Terser.
      result = await terser(code, jsMinifyOptions)
      if (result.error) {
        return code
      }

      return result.code
    }

    // CSS and JS parser functions to this.
    const htmlMinifyOptions = deepAssign({}, this._options.htmlMinifyOptions, {
      minifyCSS: this._cssProcess,
      minifyJS: this._jsProcess,
    })

    // Create HTML processor.
    this._htmlProcess = (code) => {
      return htmlMinifier.minify(code, htmlMinifyOptions)
    }
  }

  async concurrent (data) {
    // Get mode value.
    let mode
    if (this._modePropertyPath) {
      mode = getByPathSegments(data, this._modePropertyPath)
    }
    if (!mode) {
      mode = this._options.mode
    } else if (Array.isArray(mode)) {
      mode = this._options.modeArray >= 0 ? mode[this._options.modeArray] : mode[mode.length + this._options.modeArray]
    }

    let value = getByPathSegments(data, this._propertyPath)
    switch (mode) {
      case 'css':
        value = await this._cssProcessAsync(value)
        break

      case 'html':
        value = this._htmlProcess(value)
        break

      case 'js':
        value = await this._jsProcessAsync(value)
        break

      default:
        this._logger.warn('Unkown mode of value "' + mode + '" used.')
        break
    }
    data = setByPathSegments(data, this._propertyPath, value)

    return data
  }
}

export default ProcessPostprocess
