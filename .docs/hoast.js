// Manually import config.
import tailwindConfig from './tailwind.config.js'

export default {
  options: {
    directory: 'src',
  },
  collections: [{
    // Pages.
    source: ['@hoast/source-javascript', {
      directory: 'pages',
    }],
    processes: [
      ['@hoast/process-postprocess', {
        minify: process.env.NODE_ENV === 'production',
        mode: 'html',

        stylePlugins: [
          'postcss-nesting',
          'autoprefixer',
          'postcss-preset-env',
        ],
      }],
      ['@hoast/process-custom', {
        concurrent: (data) => {
          // Rename from JS extension to HTML extension.
          data.path = data.path.substring(0, data.path.lastIndexOf('.') + 1) + 'html'
          return data
        },
      }],
      ['@hoast/process-writefiles', {
        directory: '../../docs',
      }],
    ],
  }, {
    // Scripts.
    source: ['@hoast/source-readfiles', {
      directory: 'scripts',
      filterPatterns: [
        'index.js',
      ],
    }],
    processes: [
      ['@hoast/process-postprocess', {
        minify: process.env.NODE_ENV === 'production',
        mode: 'js',

        scriptPlugins: [
          'babel-plugin-module-resolver',
        ],
      }],
      ['@hoast/process-writefiles', {
        directory: '../../docs',
      }],
    ],
  }, {
    // Styles.
    source: ['@hoast/source-readfiles', {
      directory: 'styles',
      filterPatterns: [
        'index.css',
      ],
    }],
    processes: [
      ['@hoast/process-postprocess', {
        minify: process.env.NODE_ENV === 'production',
        mode: 'css',

        stylePlugins: [
          'postcss-import',
          'postcss-nesting',
          ['tailwindcss', tailwindConfig],
          ['postcss-reuse', { mode: 'class' }],
          'autoprefixer',
          'postcss-preset-env',
        ],
      }],
      ['@hoast/process-writefiles', {
        directory: '../../docs',
      }],
    ],
  }, {
    // Assets.
    source: ['@hoast/source-readfiles', {
      directory: 'assets',
      readOptions: {
        encoding: null,
      },
    }],
    processes: [
      ['@hoast/process-writefiles', {
        directory: '../../docs',

        writeOptions: {
          encoding: null,
        },
      }],
    ],
  }],
}
