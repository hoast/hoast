import Hoast from '@hoast/hoast'
import ProcessCustom from '@hoast/process-custom'
import ProcessFrontmatter from '@hoast/process-frontmatter'
import ProcessMarkdown from '@hoast/process-markdown'
import ProcessPostprocess from '@hoast/process-postprocess'
import ProcessWritefiles from '@hoast/process-writefiles'
import SourceReadfiles from '@hoast/source-readfiles'

// Import base component.
import componentHTML from './src/components/html.js'

const hoast = new Hoast()
  .addCollections([
    // Add pages collection.
    {
      // Read files from pages directory.
      source: new SourceReadfiles({
        directory: 'src/pages',
      }),
      processes: [
        // Extract frontmatter.
        new ProcessFrontmatter(),
        // Convert markdown to HTML.
        new ProcessMarkdown({
          highlightOptions: {},

          remarkPlugins: [
            'remark-external-links',
          ],
        }),
        // Template using custom function.
        new ProcessCustom({
          concurrent: (data) => {
            data.contents = componentHTML(data)

            return data
          },
        }),
        // Bundle and minify.
        new ProcessPostprocess({
          minify: process.env.NODE_ENV === 'production',

          cssPlugins: [
            'postcss-import',
            'autoprefixer',
            'postcss-preset-env',
          ],
        }),
        // Write to filesystem.
        new ProcessWritefiles({
          directory: '../docs',
        }),
      ],
    },

    // Add style sheets collection.
    {
      source: new SourceReadfiles({
        directory: 'src/styles',
      }),
      processes: [
        new ProcessPostprocess({
          mode: 'css',
          minify: process.env.NODE_ENV === 'production',

          cssPlugins: [
            'postcss-import',
            'autoprefixer',
            'postcss-preset-env',
          ],
        }),
        new ProcessWritefiles({
          directory: '../docs/styles',
        }),
      ],
    },

    // Transfer files from .assets directory over.
    {
      source: new SourceReadfiles({
        directory: 'src/assets',

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
