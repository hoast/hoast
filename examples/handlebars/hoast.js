// Import hoast and the modules.
import Hoast from '@hoast/hoast'
import ProcessLog from '@hoast/process-log'
import ProcessHandlebars from '@hoast/process-handlebars'
import SourceReadfiles from '@hoast/source-readfiles'

const hoast = new Hoast()
  .addCollections([
    {
      source: new SourceReadfiles({
        directory: 'src/pages',
      }),
      processes: [
        new ProcessHandlebars({
          templateDirectory: 'src/templates',
          templatePath: 'default.hbs',
        }),
        new ProcessLog(),
      ],
    },
  ])

export default hoast
