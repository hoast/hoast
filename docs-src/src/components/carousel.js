// Import renderer.
import { render as r } from '../utils/RenderUtils.js'

export default function (options, ...contents) {
  options = Object.assign({
    align: 'center',
    alignOnHover: false,
    width: 'w-24',
  }, options)

  let alignment
  switch (options.align.toLowerCase()) {
    case 'top':
      alignment = 'items-top'
      break

    case 'bottom':
      alignment = 'items-bottom'
      break

    default:
      alignment = 'items-center'
      break
  }

  // Flatten contents.
  contents = contents.flat(4)

  return r('div', {
    class: 'no-scrollbar overflow-x-scroll',
  }, [
    r('div', {
      class: 'table mx-auto',
    }, [
      r('ul', {
        class: 'inline-flex py-2 px-1 ' + alignment,
      }, [
        ...contents.map(
          (content, index) => {
            let transform = ''
            if (options.alignOnHover) {
              // Set the rotation of the item with every third randomized.
              transform = ' rotate-2'
              index = index % 3
              if (index === 1 || (index === 2 && Math.random() < 0.5)) {
                transform = ' -rotate-2'
              }
              // Re-align on hover.
              transform += ' hover:rotate-0 hover:scale-110'
            }

            // Return wrapped content.
            return r('div', {
              class: 'mx-1 transform ' + options.width + transform,
            }, content)
          }),
      ]),
    ]),
  ])
}
