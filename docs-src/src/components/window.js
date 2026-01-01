// Import highlight.js.
import code from './code.js'

// Import renderer.
import { render as r } from '../utils/RenderUtils.js'

export default function (options, ...contents) {
  return r('div', {
    class: 'bg-grey-0 mt-2 overflow-x-auto text-white rounded-1 shadow-lg',
  }, [
    r('div', {
      class: 'border-b border-grey-2 border-solid leading-0 p-1',
    }, [
      r('span', {
        class: 'inline-block h-0.75 w-0.75 rounded-full bg-grey-5 mr-0.5',
      }),
      r('span', {
        class: 'inline-block h-0.75 w-0.75 rounded-full bg-grey-9 mr-0.5',
      }),
      r('span', {
        class: 'inline-block h-0.75 w-0.75 rounded-full bg-grey-7',
      }),
    ]),
    r('div', {
      class: 'code-dark bg-grey-1 pl-1 py-1 md:px-2',
    }, code(options, ...contents)),
  ])
}
