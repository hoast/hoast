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
        'global.js',
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
        directory: '../../docs/scripts',
      }],
    ],
  }, {
    // Styles.
    source: ['@hoast/source-readfiles', {
      directory: 'styles',
      filterPatterns: [
        'global.css',
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
          'postcss-reuse',
          'autoprefixer',
          'postcss-preset-env',
          // TODO: In production builds run PurgeCSS, which scans the same files as tailwind except for the css files.
        ],
      }],
      ['@hoast/process-writefiles', {
        directory: '../../docs/styles',
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
        directory: '../../docs/assets',

        writeOptions: {
          encoding: null,
        },
      }],
    ],
  }],
}
