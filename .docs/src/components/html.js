import r from '../utils/render.js'

export default function ({ contents, frontmatter }) {
  // Render component.
  return r('html', {
    lang: 'en',
  }, [
    r('head', [
      // File meta data.
      r('meta', {
        charset: 'UTF-8',
      }),
      r('meta', {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0',
      }),

      // Page meta data.
      r('title', frontmatter.title),
      r('meta', {
        name: 'description',
        content: frontmatter.description,
      }),
      r('meta', {
        name: 'keywords',
        content: frontmatter.keywords,
      }),

      // Icons.
      r('link', {
        rel: 'icon',
        href: '/assets/icon-round-128.png',
        type: 'image/png',
        sizes: '128x128',
      }),
      r('link', {
        rel: 'icon',
        href: '/assets/icon-round-256.png',
        type: 'image/png',
        sizes: '256x256',
      }),
      r('link', {
        rel: 'icon',
        href: '/assets/icon-round-512.png',
        type: 'image/png',
        sizes: '512x512',
      }),

      // Style sheets.
      r('link', {
        rel: 'stylesheet',
        href: '/styles/global.css',
      }),

      r('meta', {
        name: 'theme-color',
        content: '#ffffff',
      }),
    ]),

    r('body', [
      r('div', {
        class: 'container',
      }, [
        // Markdown content.
        r('div', {
          class: 'content',
        }, contents),
      ]),
    ]),
  ])
}
