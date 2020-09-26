import Hoast from '@hoast/hoast'
import ProcessFrontmatter from '@hoast/process-frontmatter'
import ProcessHandlebars from '@hoast/process-handlebars'
import ProcessLog from '@hoast/process-log'
import ProcessMarkdown from '@hoast/process-markdown'
import ProcessPostprocess from '@hoast/process-postprocess'
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
        new ProcessFrontmatter(),
        new ProcessMarkdown(),
        new ProcessHandlebars({
          templateDirectory: 'src/layouts',
          templatePath: 'default.hbs',
        }),
        new ProcessPostprocess(),
        new ProcessLog(),
      ],
    },
    {
      source: new SourceReadfiles({
        directory: 'src',
        patterns: [
          'scripts/*',
        ],
      }),
      processes: [
        new ProcessPostprocess({
          mode: 'js',
        }),
        new ProcessLog(),
      ],
    },
    {
      source: new SourceReadfiles({
        directory: 'src',
        patterns: [
          'styles/*',
        ],
      }),
      processes: [
        new ProcessPostprocess({
          mode: 'css',
        }),
        new ProcessLog(),
      ],
    },
  ])
  .process()
