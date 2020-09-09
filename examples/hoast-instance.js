import Hoast from '@hoast/hoast'
import SourceReadfiles from '@hoast/source-readfiles'

const hoast = new Hoast()
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

export default hoast
