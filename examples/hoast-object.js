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
        },
      ],
      processes: [
        '@hoast/process-log',
      ],
    },
  ],
}
