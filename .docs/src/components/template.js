// Import renderer.
import { render as r } from '../utils/RenderUtils.js'

export default function (meta = {}, ...contents) {
  meta = Object.assign({
    image: 'https://doar.dev/assets/banner.png',
    twitter: '@RedKenrok',
    url: 'https://doar.dev',
  }, meta)

  // Render document.
  return '<!DOCTYPE html>' + r('html', {
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
      r('title', meta.title),
      r('meta', {
        name: 'description',
        content: meta.description,
      }),
      r('meta', {
        name: 'keywords',
        content: typeof (meta.keywords) === 'string' ? meta.keywords : meta.keywords.join(', '),
      }),

      // Open graph meta.
      r('meta', {
        property: 'og:description',
        content: meta.description,
      }),
      r('meta', {
        property: 'og:image',
        content: meta.image,
      }),
      r('meta', {
        name: 'og:title',
        content: meta.title,
      }),
      r('meta', {
        property: 'og:type',
        content: 'article',
      }),
      r('meta', {
        property: 'og:url',
        content: meta.url,
      }),

      // Twitter meta.
      r('meta', {
        name: 'twitter:card',
        content: 'summary_large_image',
      }),
      r('meta', {
        name: 'twitter:creator',
        content: meta.twitter,
      }),
      r('meta', {
        name: 'twitter:site',
        content: meta.twitter,
      }),
      r('meta', {
        name: 'twitter:description',
        content: meta.description,
      }),
      r('meta', {
        property: 'twitter:image',
        content: meta.image,
      }),
      r('meta', {
        name: 'twitter:title',
        content: meta.title,
      }),

      // Icons.
      r('link', {
        rel: 'icon',
        href: '/assets/icons/128-round.png',
        type: 'image/png',
        sizes: '128x128',
      }),
      r('link', {
        rel: 'icon',
        href: '/assets/icons/256-round.png',
        type: 'image/png',
        sizes: '256x256',
      }),
      r('link', {
        rel: 'icon',
        href: '/assets/icons/512-round.png',
        type: 'image/png',
        sizes: '512x512',
      }),

      r('meta', {
        name: 'theme-color',
        content: '#ffffff',
      }),

      // Style sheets.
      r('link', {
        crossorigin: 'anonymous',
        rel: 'stylesheet',
        href: '/styles/global.css',
      }),
    ]),

    r('body', [
      // Add contents.
      contents,

      // Scripts.
      r('script', {
        crossorigin: 'anonymous',
        src: '/scripts/global.js',
      }),
    ]),
  ])
}
