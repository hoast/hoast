import m from 'mithril'

export default {
  view: function ({ attrs }) {
    // Get file contents.
    const contents = attrs.data.contents

    // Render component.
    return m('html', {
      lang: 'en',
    }, [
      m('head'),
      m('body', contents.hello),
    ])
  },
}
