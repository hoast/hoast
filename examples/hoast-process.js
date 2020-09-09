import Hoast from '@hoast/hoast'
import SourceReadfiles from '@hoast/source-readfiles'

new Hoast()
  .setMeta({
    name: 'Hoast & hoastig',
    url: 'hoast.js.org',
  })
  .addCollections([
    {
      source: new SourceReadfiles({
        directory: 'src',
        patterns: [
          'content/*',
        ],
      }),
    },
  ])
  .process()
