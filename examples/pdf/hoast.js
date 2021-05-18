// Import hoast and the modules.
import Hoast from '@hoast/hoast'
import ProcessCustom from '@hoast/process-custom'
import ProcessPdf from '@hoast/process-pdf'
import ProcessWritefiles from '@hoast/process-writefiles'
import SourceReadfiles from '@hoast/source-readfiles'

// Import libraries for custom process.
import path from 'path'

const hoast = new Hoast({
  directory: 'src',
})
  .addCollections([
    {
      source: new SourceReadfiles({
        directory: null,
        filterPatterns: [
          'pages/**',
        ],
      }),
      processes: [
        new ProcessPdf({
          wrap: false,
        }),
        new ProcessCustom({
          concurrent: (data) => {
            // Remove subdirectory from path.
            data.path = path.join(path.dirname(data.path), '..', path.basename(data.path))

            // return modified data.
            return data
          },
        }),
        new ProcessWritefiles({
          directory: '../dst',
        }),
      ],
    },
  ])

export default hoast
