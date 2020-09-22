import Hoast from '@hoast/hoast'
import ProcessHandlebars from '@hoast/process-handlebars'
import ProcessLog from '@hoast/process-log'
import ProcessMarkdown from '@hoast/process-markdown'
import SourceReadfiles from '@hoast/source-readfiles'

new Hoast({}, {
  name: 'Hoast & hoastig',
  url: 'hoast.js.org',
})
  .addCollections([
    {
      source: new SourceReadfiles({
        directory: 'src',
        patterns: [
          'contents/*',
        ],
      }),
      processes: [
        new ProcessMarkdown(),
        new ProcessHandlebars({
          templateDirectory: 'src/layouts',
          templatePath: 'default.hbs',
        }),
        new ProcessLog(),
      ],
    },
  ])
  .process()
