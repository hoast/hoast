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

        // Style sheets.
        m('link', {
          rel: 'stylesheet',
          href: '/styles/global.css',
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
