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

    // Convert dot notation to path segments.
    this._propertyPath = this._options.property.split('.')
    this._setPropertyPath = this._options.setProperty.split('.')
    if (this._options.optionsProperty) {
      this._optionsPropertyPath = this._options.optionsProperty.split('.')
    }

    // Assign serve directory.
    if (!this._options.serveOptions.directory) {
      this._serveDirectory = process.cwd()
    } else if (path.isAbsolute(this._options.serveOptions.directory)) {
      this._serveDirectory = this._options.serveOptions.directory
    } else {
      this._serveDirectory = path.resolve(process.cwd(), this._options.serveOptions.directory)
    }
  }

  async initialize () {
    // Launch puppeteer.
    this._logger.info('Launching puppeteer...')
    this._browser = await puppeteer.launch({
      headless: true,
    })
    this._logger.info('Launched puppeteer.')

    // Launch server.
    this._logger.info('Launching server...')
    await new Promise((resolve) => {
      this._server = createServer(async (request, response) => {
        // Serve local files.
        return serveHandler(request, response, {
          public: this._serveDirectory,
        })
      })
      this._server.listen(this._options.serveOptions.port, () => resolve(this._server))
    })
    this._logger.info('Launched server.')
  }

  async concurrent (data) {
    // Deconstruct data.
    let value = getByPathSegments(data, this._propertyPath)
    let pdfOptions = this._options.pdfOptions
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
    if (this._options.wrap) {
      value = String.prototype.format.call(this._options.wrap, value)
    }

    // Create page.
    this._logger.info('Create new page.')
    const page = await this._browser.newPage()
    await page.goto(`http://localhost:${this._options.serveOptions.port}/${relativePath}`)

    // Add HTML to page.
    this._logger.info('Setting page contents.')
    await page.setContent(value)

    // Wait for HTML to be loaded.
    this._logger.info('Waiting for page to load.')
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.evaluate(() => history.pushState(undefined, '', '#')), // eslint-disable-line  no-undef
    ])

    // Convert to PDF.
    if (this._options.mediaType || this._options.mediaType === null) {
      this._logger.info('Setting page media type.')
      await page.emulateMediaType(this._options.mediaType)
    }
    this._logger.info('Getting page output as pdf.')
    value = await page.pdf(pdfOptions)

    // Close page.
    this._logger.info('Closing page.')
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
    this._logger.info('Closing server...')
    await new Promise((resolve) => this._server.close(resolve))
    this._logger.info('Closed server.')

    // Close puppeteer.
    this._logger.info('Closing puppeteer...')
    await this._browser.close()
    this._logger.info('Closed puppeteer.')
  }
}

export default ProcessPdf
