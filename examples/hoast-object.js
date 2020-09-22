export default {
  meta: {
    name: 'Hoast & hoastig',
    url: 'hoast.js.org',
  },
  collections: [
    {
      source: [
        '@hoast/source-readfiles',
        {
          directory: 'src',
          patterns: [
            'contents/*',
          ],
        },
      ],
      processes: [
        '@hoast/process-markdown',
        [
          '@hoast/process-handlebars',
          {
            templateDirectory: 'src/layouts',
            templatePath: 'default.hbs',
          },
        ],
        '@hoast/process-log',
      ],
    },
  ],
}
