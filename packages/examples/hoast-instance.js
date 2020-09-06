import Hoast from '@hoast/hoast'
import SourceFilesystem from '@hoast/source-filesystem'

const hoast = new Hoast()
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

export default hoast
