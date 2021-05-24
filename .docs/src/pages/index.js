// Import from node.
import { readFileSync } from 'fs';

// Import components.
import card from '../components/card.js'
import carousel from '../components/carousel.js'
import code from '../components/code.js'
import logo from '../components/logo.js'
import section from '../components/section.js'
import template from '../components/template.js'
import window from '../components/window.js'

// Import renderer.
import { render as r } from '../utils/RenderUtils.js'

// Import icon components.
const iconCopy = readFileSync('src/icons/copy-outline.svg')
const iconGithub = readFileSync('src/icons/logo-github.svg')

export default function () {
  return template(
    // Meta data.
    {
      description: 'A set of simple and modular packages for build automation.',
      keywords: ['hoast', 'modular', 'data', 'processor', 'javascript', 'static', 'page', 'generator'],
      title: 'Hoast | A modular data processor!',
    },

    // Page content.
    r('main', [
      section([
        r('div', {
          class: 'logo'
        }, logo()),

        r('h1', 'A set of simple and modular packages for build automation.'),
        r('p', ''),

        r('div', {
          class: 'bar',
        }, [
          r('a', {
            class: 'button',
            href: 'https://github.com/hoast/hoast#readme',
            target: '_blank',
          }, iconGithub),

          r('button', {
            class: 'flex-grow md:flex-grow-0',
            'onclick': () => {
              window.copyToClipboard('npm i @hoast/hoast')
            },
          }, [
            '&#160;',
            r('code', '$ npm i @hoast/hoast'),
            '&#160;&#160;',
            iconCopy,
          ]),
        ]),
      ]),

      section([
        r('h2', 'Creating a static page generator can be incredibly easy!'),
        r('p', 'Create the following configuration file in the root of your project, install the used dependencies and run the `hoast` command to start a build.'),

        r('div', {
          class: 'sm:mx-2 md:mx-8 lg:mx-12',
        }, [
          // Code.
          window({
            language: 'js',
          }, [
            "export default {",
            " options: {",
            "   directory: 'src',",
            " },",
            " collections: [{",
            "   source: ['@hoast/source-readfiles', {",
            "     directory: 'pages',",
            "   }],",
            "   processes: [",
            "     '@hoast/process-frontmatter',",
            "     '@hoast/process-markdown',",
            "     ['@hoast/process-handlebars', {",
            "       templateDirectory: 'layouts',",
            "       templatePath: 'default.hbs',",
            "     }],",
            "     ['@hoast/process-writefiles', {",
            "       directory: '../dst',",
            "     }],",
            "   ],",
            " }],",
            "}",
          ]),

          r('div', { class: 'px-2 py-1' }, 'Configuration files can have many forms `JSON`, `JavaScript` objects, `Hoast` instances, or use the API directly and call the process function to start building.')
        ]),
      ]),

      section([
        r('h2', 'Customize to what you need!'),
        r('p', 'First import the core package, and start adding collections. Each collection needs a source plugin as wel as a series of processors to transform the data.'),
      ]),

      r('div', {
        class: 'mb-6 -mt-4',
      }, [
        carousel({
          alignOnHover: true,
        }, [
          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/hoast#readme',
          }, '@hoast/hoast', 'The core package of hoast responsible for managing and running the other packages.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/source-readfiles#readme',
          }, '@hoast/source-filesystem', 'Read files from the filesystem.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/source-javascript#readme',
          }, '@hoast/source-javascript', 'Read and execute script from the filesystem.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/source-custom#readme',
          }, '@hoast/source-custom', 'Allows you to provide your own custom source functions.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/process-writefiles#readme',
          }, '@hoast/process-writefiles', 'Write data to the filesystem.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/process-frontmatter#readme',
          }, '@hoast/process-frontmatter', 'Extract frontmatter from a text value.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/process-parse#readme',
          }, '@hoast/process-parse', 'Parse a text value using a function or package.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/process-markdown#readme',
          }, '@hoast/process-markdown', 'Convert markdown to HTML using Unified.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/process-handlebars#readme',
          }, '@hoast/process-handlebars', 'Template using Handlebars.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/process-javascript#readme',
          }, '@hoast/process-javascript', 'Retrieve and execute JavaScript.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/process-postprocess#readme',
          }, '@hoast/process-postprocess', 'Process CSS, HTML, and JS using PostCSS, Unified, Babel, and Terser.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/process-pdf#readme',
          }, '@hoast/process-pdf', 'Converts HTML to PDF using puppeteer.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/process-log#readme',
          }, '@hoast/process-log', 'Log data to the terminal, useful for developing other process and source packages.'),

          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/process-custom#readme',
          }, '@hoast/process-custom', 'Allows you to provide your own custom process functions.'),
        ]),
      ]),
    ]),

    r('footer', [
      section([
        r('div', {
          class: 'branch',
        }, [
          r('div', {
            class: 'logo'
          }, logo()),
          r('ul', [
            r('li', [
              r('a', {
                href: 'https://github.com/hoast/hoast#readme',
                target: '_blank',
              }, 'GitHub')
            ]),
            r('li', [
              r('a', {
                href: 'https://npmjs.com/org/hoast/',
                target: '_blank',
              }, 'NPM')
            ]),
            r('li', [
              r('a', {
                href: 'https://rondekker.com',
                target: '_blank',
              }, 'From Ron Dekker')
            ]),
          ]),
        ]),
      ]),
    ])
  )
}
