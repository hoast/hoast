// Import from node.
import { readFileSync } from 'fs'

// Import renderer.
import { render as r } from '../utils/RenderUtils.js'

// Import icon components.
const iconOpen = readFileSync('src/icons/open-outline.svg')

export default function (options = {}, title = '', description = '', ...children) {
  // Override default options.
  options = Object.assign({
    href: null,
    target: '_blank',
  }, options)

  const tag = options.href ? 'a' : 'div'
  const attributes = {
    class: 'card',
  }
  const content = [
    r('div', {
      class: 'heading text-2',
    }, title),

    r('p', description),

    ...children,
  ]

  if (options.href) {
    attributes.href = options.href
    if (options.target) {
      attributes.target = options.target
    }

    content.push(
      r('p', {
        class: 'hover-a:underline text-0',
      }, [
        'Learn more ',
        iconOpen,
      ])
    )
  }

  return r(tag, attributes, content)
}
