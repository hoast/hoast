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
          directory: 'src/pages',
        },
      ],
      processes: [
        '@hoast/process-frontmatter',
        '@hoast/process-markdown',
        [
          '@hoast/process-handlebars',
          {
            templateDirectory: 'src/layouts',
            templatePath: 'default.hbs',
          },
        ],
        '@hoast/process-postprocess',
        [
          '@hoast/process-writefiles',
          {
            directory: 'dst',
          },
        ],
      ],
    },
    {
      source: [
        '@hoast/source-readfiles',
        {
          directory: 'src',
          patterns: [
            'scripts/*',
          ],
        },
      ],
      processes: [
        [
          '@hoast/process-postprocess',
          {
            mode: 'js',
          },
        ],
        [
          '@hoast/process-writefiles',
          {
            directory: 'dst',
          },
        ],
      ],
    },
    {
      source: [
        '@hoast/source-readfiles',
        {
          directory: 'src',
          patterns: [
            'styles/*',
          ],
        },
      ],
      processes: [
        [
          '@hoast/process-postprocess',
          {
            mode: 'css',
          },
        ],
        [
          '@hoast/process-writefiles',
          {
            directory: 'dst',
          },
        ],
      ],
    },
  ],
}
