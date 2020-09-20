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
          'content/*',
        ],
        readOptions: {
          encoding: 'utf8',
        },
      }),
      processes: [
        new ProcessMarkdown({
          filterProperty: 'extensions',
          filterPatterns: [
            'md',
            'markdown',
          ],
          filterOptions: {
            all: false,
          },
        }),
        new ProcessHandlebars({
          filterProperty: 'extensions',
          filterPatterns: [
            'hbs',
            'handlebars',
          ],
          filterOptions: {
            all: false,
          },
          templateDirectory: 'src/layout',
          templatePath: 'default.hbs',
        }),
        new ProcessLog(),
      ],
    },
  ])
  .process()
