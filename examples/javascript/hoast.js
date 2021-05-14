import Hoast from '@hoast/hoast'
import ProcessLog from '@hoast/process-log'
import SourceJavascript from '@hoast/source-javascript'

const hoast = new Hoast()
  .addCollections([
    {
      source: new SourceJavascript({
        directory: 'src/pages',
      }),
      processes: [
        new ProcessLog(),
      ],
    },
  ])

export default hoast
