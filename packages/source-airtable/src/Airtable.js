// Import build-in modules.
import https from 'https'

const URL = 'https://api.airtable.com/v0/'
const HEADERS = {
  Accept: 'application/json',
  Authorization: null,
}

const get = (
  url,
  headers,
) => {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers,
    }, (response) => {
      let responseBody = ''
      const responseHeaders = response.headers
      response.on('data', (chunk) => {
        responseBody += chunk
      })
      response.on('close', () => {
        if (
          ('Content-type' in responseHeaders && responseHeaders['Content-type'] === 'application/json') ||
          ('Accept' in headers && headers.Accept === 'application/json')
        ) {
          try {
            responseBody = JSON.parse(responseBody)
          } catch (error) {
            reject(error)
          }
        }

        resolve(responseBody)
      })
    })
  })
}

class Airtable {
  constructor(
    authorizationToken,
  ) {
    this._authorizationToken = authorizationToken
  }

  async listBases () {
    return await get(
      URL + 'meta/bases',
      Object.assign(HEADERS, {
        Authorization: 'Bearer ' + this._authorizationToken,
      }),
    )
  }

  async getBaseSchema (
    baseId,
  ) {
    return await get(
      URL + 'meta/bases/' + baseId + '/tables',
      Object.assign(HEADERS, {
        Authorization: 'Bearer ' + this._authorizationToken,
      }),
    )
  }

  async listRecords (
    baseId,
    tableIdOrName,
  ) {
    return await get(URL + baseId + '/' + tableIdOrName,
      Object.assign(HEADERS, {
        Authorization: 'Bearer ' + this._authorizationToken,
      }),
    )
  }
}

export default Airtable
