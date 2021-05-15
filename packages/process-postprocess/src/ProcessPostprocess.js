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

const MODES = [
  'css',
  'html',
  'js',
]

class ProcessPostprocess extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      property: 'contents',
      mode: 'html',
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
    options = this.getOptions()

    if (MODES.indexOf(options.mode) < 0) {
      this.getLogger().error('Unknown mode used. Mode:  "' + options.mode + '".')
    }

    // Convert dot notation to path segments.
    this._propertyPath = options.property.split('.')
    if (options.modeProperty) {
      this._modePropertyPath = options.modeProperty.split('.')
    }
  }

  async initialize () {
    const options = this.getOptions()

    // Setup Postcss plugins.
    let cssPlugins = options.cssPlugins ? options.cssPlugins : []
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
    if (options.minify && options.cssMinifyOptions) {
      cssPlugins.push(cssnano(options.cssMinifyOptions))
    }

    // Setup Postcss.
    const postcss = new Postcss(cssPlugins)
    // Store options.
    const cssOptions = deepAssign({
    }, options.cssOptions, {
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
    const jsOptions = deepAssign({}, options.jsOptions)
    const jsMinifyOptions = deepAssign({}, options.jsMinifyOptions)

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
    const htmlMinifyOptions = deepAssign({}, options.htmlMinifyOptions, {
      minifyCSS: this._cssProcess,
      minifyJS: this._jsProcess,
    })

    // Create HTML processor.
    this._htmlProcess = (code) => {
      return htmlMinifier.minify(code, htmlMinifyOptions)
    }
  }

  async concurrent (data) {
    const options = this.getOptions()

    let value = getByPathSegments(data, this._propertyPath)
    switch (options.mode) {
      case 'css':
        value = await this._cssProcessAsync(value)
        break

      case 'html':
        value = this._htmlProcess(value)
        break

      case 'js':
        value = await this._jsProcessAsync(value)
        break
    }
    data = setByPathSegments(data, this._propertyPath, value)

    return data
  }

  final () {
    super.final()

    this._cssProcessAsync = null
    this._htmlProcess = null
    this._jsProcessAsync = null
  }
}

export default ProcessPostprocess
