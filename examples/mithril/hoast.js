import Hoast from '@hoast/hoast'
import ProcessLog from '@hoast/process-log'
import ProcessMithril from '@hoast/process-mithril'
import SourceReadfiles from '@hoast/source-readfiles'

const hoast = new Hoast()
  .addCollections([
    {
      source: new SourceReadfiles({
        directory: 'src/pages',
      }),
      processes: [
        new ProcessMithril({
          componentDirectory: 'src/components',
          componentPath: 'html.js',

          prefix: '<!DOCTYPE html>',
        }),
        new ProcessLog(),
      ],
    },
  ])

export default hoast
