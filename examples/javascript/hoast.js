export default {
  options: {
    directory: 'src',
  },
  collections: [{
    source: ['@hoast/source-readfiles', {
      directory: 'pages',
    }],
    processes: [
      ['@hoast/process-javascript', {
        importPath: 'components/html.js',
      }],
      '@hoast/process-log',
    ],
  }],
}
