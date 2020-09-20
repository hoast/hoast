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
            'content/*',
          ],
          readOptions: {
            encoding: 'utf8',
          },
        },
      ],
      processes: [
        [
          '@hoast/process-markdown',
          {
            filterProperty: 'extensions',
            filterPatterns: [
              'md',
              'markdown',
            ],
            filterOptions: {
              all: false,
            },
          },
        ],
        [
          '@hoast/process-handlebars',
          {
            filterProperty: 'extensions',
            filterPatterns: [
              'hbs',
              'handlebars',
            ],
            filterOptions: {
              all: false,
            },
            templateDirectory: 'src/layout',
            templatePath: 'default.hbs',
          },
        ],
        '@hoast/process-log',
      ],
    },
  ],
}
