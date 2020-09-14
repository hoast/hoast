import Hoast from '@hoast/hoast'
import SourceReadfiles from '@hoast/source-readfiles'
import ProcessLog from '@hoast/process-log'

new Hoast({}, {
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
  .process()
