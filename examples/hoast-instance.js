import Hoast from '@hoast/hoast'
import ProcessLog from '@hoast/process-log'
import SourceReadfiles from '@hoast/source-readfiles'

const hoast = new Hoast({}, {
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
        readOptions: {
          encoding: 'utf8',
        },
      }),
      processes: [
        new ProcessLog(),
      ],
    },
  ])

export default hoast
