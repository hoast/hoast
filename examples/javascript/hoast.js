// Import hoast and the modules.
import Hoast from '@hoast/hoast'
import ProcessLog from '@hoast/process-log'
import ProcessJavascript from '@hoast/process-javascript'
import SourceReadfiles from '@hoast/source-readfiles'

const hoast = new Hoast()
  .addCollections([
    {
      source: new SourceReadfiles({
        directory: 'src/pages',
      }),
      processes: [
        new ProcessJavascript({
          importPath: 'src/components/html.js',
        }),
        new ProcessLog(),
      ],
    },
  ])

export default hoast
