export default {
  options: {
    directory: 'src',
  },
  collections: [{
    source: ['@hoast/source-readfiles', {
      directory: 'pages',
    }],
    processes: [
      ['@hoast/process-handlebars', {
        templateDirectory: 'templates',
        templatePath: 'default.hbs',
      }],
      '@hoast/process-log',
    ],
  }],
}
