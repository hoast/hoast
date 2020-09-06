import Hoast from '@hoast/hoast'
import SourceFilesystem from '@hoast/source-filesystem'

new Hoast()
  .setMeta({
    name: 'Hoast & hoastig',
    url: 'hoast.js.org',
  })
  .addCollections([
    {
      source: new SourceFilesystem({
        directory: 'src',
        patterns: [
          'content/*',
        ],
      }),
    },
  ])
  .process()
