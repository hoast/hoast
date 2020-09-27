import Hoast from '@hoast/hoast'
import ProcessFrontmatter from '@hoast/process-frontmatter'
import ProcessMarkdown from '@hoast/process-markdown'
import ProcessMithril from '@hoast/process-mithril'
import ProcessPostprocess from '@hoast/process-postprocess'
import ProcessWritefiles from '@hoast/process-writefiles'
import SourceReadfiles from '@hoast/source-readfiles'

const collectionPages = {
  // Read files from pages directory.
  source: new SourceReadfiles({
    directory: 'src/pages',

    patterns: [
      '*.md',
    ],
  }),
  processes: [
    // Extract frontmatter.
    new ProcessFrontmatter(),
    // Convert markdown to HTML.
    new ProcessMarkdown({
      highlightOptions: {},
    }),
    // Template using mithril.
    new ProcessMithril({
      componentDirectory: 'src/components',
      componentPath: 'html.js',

      prefix: '<!DOCTYPE html>',
    }),
  ],
}
const collectionScripts = {
  source: new SourceReadfiles({
    directory: 'src/scripts',
  }),
  processes: [],
}
const collectionStyles = {
  source: new SourceReadfiles({
    directory: 'src/styles',
  }),
  processes: [],
}

// Only run post process on production builds.
if (process.env.NODE_ENV === 'production') {
  collectionPages.processes.push(
    new ProcessPostprocess()
  )
  collectionScripts.processes.push(
    new ProcessPostprocess({
      mode: 'js',
    })
  )
  collectionStyles.processes.push(
    new ProcessPostprocess({
      mode: 'css',
    })
  )
}

// Write files to filesystem.
collectionPages.processes.push(
  new ProcessWritefiles({
    directory: '../docs',
  })
)
collectionScripts.processes.push(
  new ProcessWritefiles({
    directory: '../docs/scripts',
  })
)
collectionStyles.processes.push(
  new ProcessWritefiles({
    directory: '../docs/styles',
  })
)

const hoast = new Hoast()
  .addCollections([
    // Add pages collection.
    collectionPages,
    // Add scripts collection.
    // TODO: Fix why babel or terser does not seem to resolve.
    // collectionScripts,
    // Add style sheets collection.
    collectionStyles,
    // Transfer files from .assets directory over.
    {
      source: new SourceReadfiles({
        directory: '../_assets',

        readOptions: {
          encoding: null,
        },
      }),
      processes: [
        new ProcessWritefiles({
          directory: '../docs/assets',

          writeOptions: {
            encoding: null,
          },
        }),
      ],
    },
  ])

export default hoast
