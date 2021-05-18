// Import libraries for custom process.
import path from 'path'

export default {
  options: {
    directory: 'src',
  },
  collections: [{
    source: ['@hoast/source-readfiles', {
      directory: null,
      filterPatterns: [
        'pages/**',
      ],
    }],
    processes: [
      ['@hoast/process-pdf', {
        wrap: false,
      }],
      ['@hoast/process-custom', {
        concurrent: (data) => {
          // Remove subdirectory from path.
          data.path = path.join(path.dirname(data.path), '..', path.basename(data.path))

          // return modified data.
          return data
        },
      }],
      ['@hoast/process-writefiles', {
        directory: '../dst',
      }],
    ],
  }],
}
