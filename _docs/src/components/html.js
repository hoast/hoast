import m from 'mithril'

export default {
  view: function ({ attrs }) {
    // Get file contents.
    const frontmatter = attrs.data.frontmatter
    const contents = attrs.data.contents

    // Render component.
    return m('html', {
      lang: 'en',
    }, [
      m('head', [
        // File meta data.
        m('meta', {
          charset: 'UTF-8',
        }),
        m('meta', {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0',
        }),

        // Page meta data.
        m('title', frontmatter.title),
        m('meta', {
          name: 'description',
          content: frontmatter.description,
        }),
        m('meta', {
          name: 'keywords',
          content: frontmatter.keywords,
        }),

        // Icons.
        m('link', {
          rel: 'icon',
          href: '/assets/icon-round-128.png',
          type: 'image/png',
          sizes: '128x128',
        }),
        m('link', {
          rel: 'icon',
          href: '/assets/icon-round-256.png',
          type: 'image/png',
          sizes: '256x256',
        }),
        m('link', {
          rel: 'icon',
          href: '/assets/icon-round-512.png',
          type: 'image/png',
          sizes: '512x512',
        }),

        // Style sheets.
        m('link', {
          rel: 'stylesheet',
          href: '/styles/global.css',
        }),

        m('meta', {
          name: 'theme-color',
          content: '#ffffff',
        }),
      ]),

      m('body',
        // Markdown content.
        m('div', {
          class: 'container',
        }, m.trust(contents)),

        // Scripts.
        m('script', {
          src: '/scripts/global.js',
        })
      ),
    ])
  },
}
