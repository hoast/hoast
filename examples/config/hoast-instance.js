import Hoast from '@hoast/hoast'
import ProcessLog from '@hoast/process-log'
import SourceReadfiles from '@hoast/source-readfiles'

const hoast = new Hoast()
  .addCollections([
    {
      source: new SourceReadfiles({
        directory: 'src/pages',
      }),
      processes: [
        new ProcessLog(),
      ],
    },
  ])

export default hoast
