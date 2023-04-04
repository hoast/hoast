import dotenv from 'dotenv'
dotenv.config()

export default {
  options: {
    directory: 'src',
  },
  metaCollections: [{
    source: ['@hoast/source-airtable', {
      token: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
      baseId: process.env.AIRTABLE_BASE_ID_OR_NAME,
      mode: 'row',
      tableIdOrName: process.env.AIRTABLE_TABLE_NAME,
    }],
    processes: [
      '@hoast/process-log',
    ],
  }],
  collections: [{
    source: ['@hoast/source-airtable', {
      token: process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
      baseId: process.env.AIRTABLE_BASE_ID_OR_NAME,

      filterPatterns: [
        process.env.AIRTABLE_TABLE_NAME_PREFIX + '**',
      ],
    }],
    processes: [
      '@hoast/process-log',
    ],
  }],
}
