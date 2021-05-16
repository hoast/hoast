// Import hoast and the modules.
import Hoast from '@hoast/hoast'
import ProcessLog from '@hoast/process-log'
import SourceReadfiles from '@hoast/source-readfiles'

const hoast = new Hoast()
  .addCollections([
    {
      source: new SourceReadfiles({
        directory: 'src',
      }),
      processes: [
        new ProcessLog(),
      ],
    },
  ])

export default hoast
