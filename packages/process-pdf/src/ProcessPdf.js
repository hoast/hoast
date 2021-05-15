// Import node modules.
import { createServer } from 'http'
import path from 'path'

// Import base class.
import BaseProcess from '@hoast/base-process'

// Import utility modules.
import deepAssign from '@hoast/utils/deepAssign.js'
import { getByPathSegments } from '@hoast/utils/get.js'
import { setByPathSegments } from '@hoast/utils/set.js'

// Import puppeteer library.
import serveHandler from 'serve-handler'
import puppeteer from 'puppeteer'

const EXTENSIONS_FROM = ['html', 'xml']
const EXTENSIONS_TO = 'pdf'

class ProcessPdf extends BaseProcess {
  /**
   * Create package instance.
   * @param  {...Object} options Options objects.
   */
  constructor(options) {
    super({
      property: 'contents',
      setProperty: 'contents',
      optionsProperty: false,

      mediaType: false,
      pdfOptions: {},
      serveOptions: {
        directory: null,
        port: 3000,
      },
      wrap: '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>{0}</body></html>',
    }, options)
    options = this.getOptions()

    // Convert dot notation to path segments.
    this._propertyPath = options.property.split('.')
    this._setPropertyPath = options.setProperty.split('.')
    if (options.optionsProperty) {
      this._optionsPropertyPath = options.optionsProperty.split('.')
    }
  }

  async initialize () {
    const libraryOptions = this.getLibrary().getOptions()
    const options = this.getOptions()

    // Assign serve directory.
    if (!options.serveOptions.directory) {
      this._serveDirectory = libraryOptions.directoryPath
    } else if (path.isAbsolute(options.serveOptions.directory)) {
      this._serveDirectory = options.serveOptions.directory
    } else {
      this._serveDirectory = path.resolve(libraryOptions.directoryPath, options.serveOptions.directory)
    }

    // Launch puppeteer.
    this.getLogger().info('Launching puppeteer...')
    this._browser = await puppeteer.launch({
      headless: true,
    })
    this.getLogger().info('Launched puppeteer.')

    // Launch server.
    this.getLogger().info('Launching server...')
    await new Promise((resolve) => {
      this._server = createServer(async (request, response) => {
        // Serve local files.
        return serveHandler(request, response, {
          public: this._serveDirectory,
        })
      })
      this._server.listen(options.serveOptions.port, () => resolve(this._server))
    })
    this.getLogger().info('Launched server.')
  }

  async concurrent (data) {
    const options = this.getOptions()

    // Deconstruct data.
    let value = getByPathSegments(data, this._propertyPath)
    let pdfOptions = options.pdfOptions
    if (this._optionsPropertyPath) {
      pdfOptions = deepAssign({}, pdfOptions, getByPathSegments(data, this._optionsPropertyPath))
    }

    // Construct directory path relative to served directory.
    let relativePath = ''
    if (data.path) {
      const directoryPath = path.dirname(data.path)
      if (directoryPath !== '.') {
        relativePath = directoryPath
        if (relativePath.startsWith(this._serveDirectory)) {
          relativePath = relativePath.substring(this._serveDirectory.length - 1)
        }
        relativePath = path.normalize(relativePath)
        relativePath = encodeURIComponent(relativePath)
      }
    }

    // Format using wrap if set.
    if (options.wrap) {
      value = String.prototype.format.call(options.wrap, value)
    }

    // Create page.
    this.getLogger().info('Create new page.')
    const page = await this._browser.newPage()
    await page.goto(`http://localhost:${options.serveOptions.port}/${relativePath}`)

    // Add HTML to page.
    this.getLogger().info('Setting page contents.')
    await page.setContent(value)

    // Wait for HTML to be loaded.
    this.getLogger().info('Waiting for page to load.')
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.evaluate(() => history.pushState(undefined, '', '#')), // eslint-disable-line  no-undef
    ])

    // Convert to PDF.
    if (options.mediaType || options.mediaType === null) {
      this.getLogger().info('Setting page media type.')
      await page.emulateMediaType(options.mediaType)
    }
    this.getLogger().info('Getting page output as pdf.')
    value = await page.pdf(pdfOptions)

    // Close page.
    this.getLogger().info('Closing page.')
    await page.close()

    // Set value.
    data = setByPathSegments(data, this._setPropertyPath, value)

    // Change extension.
    if (data.path) {
      // Split path into segments.
      const pathSegments = data.path.split('.')
      // Check if file ends with an expected extension.
      if (EXTENSIONS_FROM.indexOf(pathSegments[pathSegments.length - 1]) >= 0) {
        // Remove existing extension.
        pathSegments.pop()
        // Add html extension.
        pathSegments.push(EXTENSIONS_TO)
        // Write path back to data.
        data.path = pathSegments.join('.')
      }
    }

    return data
  }

  async final () {
    super.final()

    // Close server.
    this.getLogger().info('Closing server...')
    await new Promise((resolve) => this._server.close(resolve))
    this.getLogger().info('Closed server.')

    // Close puppeteer.
    this.getLogger().info('Closing puppeteer...')
    await this._browser.close()
    this.getLogger().info('Closed puppeteer.')

    this._serveDirectory = null
  }
}

export default ProcessPdf
