export default {
  options: {
    directory: 'src',
  },
  collections: [{
    source: ['source-readfiles', {
      directory: 'pages',
    }],
    processes: [
      ['process-javascript', {
        importPath: 'components/html.js',
      }],
      'process-log',
    ],
  }],
}
