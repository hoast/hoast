export default {
  collections: [
    {
      source: [
        '@hoast/source-readfiles',
        {
          directory: 'src/pages',
        },
      ],
      processes: [
        '@hoast/process-log',
      ],
    },
  ],
}
