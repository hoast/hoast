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
      pdfOptions: {
        format: 'a4',
      },
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
    const logger = this.getLogger()
    const options = this.getOptions()

    // Assign serve directory.
    if (!options.serveOptions.directory) {
      this._serveDirectory = libraryOptions.directoryPath
    } else if (path.isAbsolute(options.serveOptions.directory)) {
      this._serveDirectory = options.serveOptions.directory
    } else {
      this._serveDirectory = path.resolve(libraryOptions.directoryPath, options.serveOptions.directory)
    }

    if (!this._browser) {
      // Launch puppeteer.
      logger.info('Launching puppeteer...')
      this._browser = await puppeteer.launch({
        headless: true,
      })
      logger.info('Launched puppeteer.')
    }

    if (!this._server) {
      // Launch server.
      logger.info('Launching server...')
      await new Promise((resolve) => {
        this._server = createServer(async (request, response) => {
          // Serve local files.
          return serveHandler(request, response, {
            public: this._serveDirectory,
          })
        })
        this._server.listen(options.serveOptions.port, () => resolve(this._server))
      })
      logger.info('Launched server.')
    }
  }

  async concurrent (data) {
    const library = this.getLibrary()
    const libraryOptions = library.getOptions()
    const logger = this.getLogger()
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
    logger.info('Create new page.')
    const page = await this._browser.newPage()
    const pageHost = `http://localhost:${options.serveOptions.port}/`
    const pageUrl = pageHost + relativePath

    let requestHandler
    if (library.isWatching()) {
      // Wait for page to be loaded, we don't want to handle network request from the previous relative path page.
      // await page.waitForNavigation({ waitUntil: 'networkidle0' })

      logger.info('Track page\'s requests.')

      // Keep track of requested resources, whether they are successful or not is irrelevant.
      requestHandler = (interceptedRequest) => {
        const url = interceptedRequest.url()

        // Ignore current page.
        if (url === pageUrl) {
          return
        }

        // Exit early if external resource.
        if (!url.startsWith(pageHost)) {
          return
        }

        // Make path absolute to served directory.
        let filePath = url.substring(pageHost.length)
        filePath = path.resolve(this._serveDirectory, filePath)

        // Ignore if not inside watched directory.
        if (!filePath.startsWith(libraryOptions.directoryPath)) {
          return
        }

        library.addAccessed(data.sourceIdentifier, filePath)
      }
      page.on('request', requestHandler)
    }
    await page.goto(pageUrl)

    // Add HTML to page.
    logger.info('Setting page contents.')
    await page.setContent(value)

    // Wait for HTML to be loaded.
    logger.info('Waiting for page to load.')
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      page.evaluate(() => history.pushState(undefined, '', '#')), // eslint-disable-line  no-undef
    ])

    if (library.isWatching() && requestHandler) {
      logger.info('Stop tracking requests.')
      page.off('request', requestHandler)
    }

    // Convert to PDF.
    if (options.mediaType || options.mediaType === null) {
      logger.info('Setting page media type.')
      await page.emulateMediaType(options.mediaType)
    }
    logger.info('Getting page output as pdf.')
    value = await page.pdf(pdfOptions)

    // Close page.
    logger.info('Closing page.')
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

    // Only cleanup when not watching.
    if (!this.getLibrary().isWatching()) {
      const logger = this.getLogger()

      // Close server.
      logger.info('Closing server...')
      await new Promise((resolve) => this._server.close(resolve))
      this._server = null
      logger.info('Closed server.')

      // Close puppeteer.
      logger.info('Closing puppeteer...')
      await this._browser.close()
      this._browser = null
      logger.info('Closed puppeteer.')

      this._serveDirectory = null
    }
  }
}

export default ProcessPdf
