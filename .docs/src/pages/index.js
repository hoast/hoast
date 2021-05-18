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

        r('h1', ''),
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
        r('h2', ''),
        r('p', ''),
      ]),

      section([
        r('h2', ''),
        r('p', ''),

        // Code.
        window({}, [
        ]),
      ]),

      section([
        r('h2', ''),
        r('p', ''),
      ]),

      r('div', {
        class: 'mb-6 -mt-4',
      }, [
        carousel({
          alignOnHover: true,
        }, [
          card({
            href: 'https://github.com/hoast/hoast/tree/master/packages/hoast#readme',
          }, '@hoast/hoast', ''),
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
