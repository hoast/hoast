export default {
  meta: {
    name: 'Hoast & hoastig',
    url: 'hoast.js.org',
  },
  collections: [
    {
      source: [
        '@hoast/source-filesystem',
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
        '@hoast/process-log',
      ],
    },
  ],
}
