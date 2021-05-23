export default {
  options: {
    directory: 'src',
  },
  collections: [{
    source: ['source-readfiles', {
      directory: 'pages',
    }],
    processes: [
      ['process-handlebars', {
        templateDirectory: 'templates',
        templatePath: 'default.hbs',
      }],
      'process-log',
    ],
  }],
}
