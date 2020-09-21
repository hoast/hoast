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
            templatePath: 'html.hbs',
          },
        ],
        [
          '@hoast/process-riot',
          {
            filterProperty: 'extensions',
            filterPatterns: [
              'riot',
            ],
            filterOptions: {
              all: false,
            },
            riotOptions: {
              root: true,
            },
            componentDirectory: 'src/layout',
            componentPath: 'html.riot',
          },
        ],
        '@hoast/process-log',
      ],
    },
  ],
}
