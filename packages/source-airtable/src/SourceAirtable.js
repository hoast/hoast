// Import base module.
import BaseSource from '@hoast/base-source'

// Import api module.
import _Airtable from './Airtable.js'

// Import utility modules.
import planckmatch from 'planckmatch'

export const Airtable = _Airtable

export class SourceAirtable extends BaseSource {
  static MODE_ROW = 'row'
  static MODE_TABLE = 'table'

  /**
   * Create package instance.
   * @param  {Object} options Options objects.
   */
  constructor(options) {
    super({
      cache: true,

      token: null,
      baseId: null,
      mode: SourceAirtable.MODE_TABLE,
      tableIdOrName: null, /* Row mode only. */
      tableWithRows: true, /* Table mode only. */

      filterPatterns: null,
      filterOptions: {
        all: false,
      },
    }, options)
    options = this.getOptions()

    // Parse patterns into regular expressions.
    if (options.filterPatterns && options.filterPatterns.length > 0) {
      this._expressions = options.filterPatterns.map(pattern => {
        return planckmatch.parse(pattern, options.filterOptions, true)
      })
    }

    // Setup Airtable api instance.
    this._airtable = new Airtable(options.token)

    this._rows = {}
    this._tables = {}
  }

  async initialize () {
    const options = this.getOptions()

    // Reset indices
    this._rowIndices = {}
    this._tableIndices = {}

    // Try and get tables of base.
    if (!options.cache || !this._tables[options.baseId]) {
      let tables = (await this._airtable.getBaseSchema(options.baseId)).tables

      this._rows[options.baseId] = {}
      this._rowIndices[options.baseId] = {}
      for (const table of tables) {
        this._rows[options.baseId][table.id] = null
        this._rowIndices[options.baseId][table.id] = -1
      }

      tables = tables.reverse()
      this._tables[options.baseId] = tables
    }
    this._tableIndices[options.baseId] = 0
  }

  async sequential () {
    const options = this.getOptions()

    if (options.mode === SourceAirtable.MODE_ROW) {
      return await this._sequentialRow()
    }
    return this._sequentialTable()
  }

  async _sequentialRow () {
    const options = this.getOptions()

    // Get table.
    const tables = this._tables[options.baseId]
    let table
    for (let index = 0; index < tables.length; index++) {
      if (
        tables[index].id === options.tableIdOrName ||
        tables[index].name === options.tableIdOrName
      ) {
        table = tables[index]
      }
    }

    if (
      !(table.id in this._rows[options.baseId]) ||
      !this._rows[options.baseId][table.id]
    ) {
      this._rows[options.baseId][table.id] = (await this._airtable.listRecords(options.baseId, options.tableIdOrName)).records
    }

    if (
      table.id in this._rowIndices[options.baseId] &&
      this._rows[options.baseId][table.id].length - 1 >= this._rowIndices[options.baseId][table.id]
    ) {
      this._rowIndices[options.baseId][table.id]++
      return this._rows[options.baseId][table.id][this._rowIndices[options.baseId][table.id]]
    }

    this.exhausted = true
  }

  _sequentialTable () {
    const options = this.getOptions()
    const tables = this._tables[options.baseId]
    let index = this._tableIndices[options.baseId]

    while (index < tables.length) {
      const table = tables[index]
      this._tableIndices[options.baseId] = ++index

      // Check if name matches the patterns.
      if (this._expressions) {
        // Skip and splice if it does not matches.
        const matches = options.filterOptions.all
          ? planckmatch.match.all(table.name, this._expressions)
          : planckmatch.match.any(table.name, this._expressions)
        if (!matches) {
          continue
        }
      }

      return table
    }

    this.exhausted = true
  }

  async concurrent (data) {
    // Exit early if invalid parameters.
    if (!data) {
      return
    }
    const options = this.getOptions()

    if (options.mode === SourceAirtable.MODE_ROW) {
      return this._concurrentRow(data)
    }
    return await this._concurrentTable(data)
  }

  async _concurrentRow (data) {
    return data
  }

  async _concurrentTable (data) {
    const options = this.getOptions()

    if (!options.cache || !this._rows[options.baseId][data.id]) {
      this._rows[options.baseId][data.id] = await this._airtable.listRecords(options.baseId, data.id).records
    }
    data.records = this._rows[options.baseId][data.id]

    return data
  }
}

export default SourceAirtable
