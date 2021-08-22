const BROAD_MATCH_GLOBAL_REGEXP = /[^<>"'`;,\s]*[^<>"'`;\s:]/g
const INNER_MATCH_GLOBAL_REGEXP = /[^<>"'`;,\s.(){}[\]#=%]*[^<>"'`;\s.(){}[\]#=%:]/g

const FONT_SIZE = 1.05
const FONT_FACTOR = 1.15

export default {
  corePlugins: {
    container: false,
  },

  purge: {
    content: [
      './src/components/**/*.js',
      './src/icons/**/*.svg',
      './src/pages/**/*.js',
      './src/scripts/**/*.js',
      './src/styles/**/*.css',
      './src/utils/**/*.js',
    ],
    options: {
      defaultExtractor: (line) => {
        return [...(line.match(BROAD_MATCH_GLOBAL_REGEXP) || []), ...(line.match(INNER_MATCH_GLOBAL_REGEXP) || [])]
      },
    }
  },

  theme: {
    borderRadius: (theme) => ({
      DEFAULT: '0.25rem',
      ...theme('spacing'),
      full: '9999px',
    }),

    colors: {
      transparent: 'transparent',
      current: 'currentColor',

      black: '#000',
      white: '#fff',

      grey: {
        0: '#171717',
        1: '#222',
        2: '#373737',
        3: '#555',
        4: '#676767',
        5: '#888',
        6: '#979797',
        7: '#bbb',
        8: '#c7c7c7',
        9: '#ddd',
      },
    },

    fontFamily: false,
    fontSize: {
      root: '1rem',
      '-2': (FONT_SIZE / (Math.pow(FONT_FACTOR, 2))) + 'rem',
      '-1': (FONT_SIZE / FONT_FACTOR) + 'rem',
      0: FONT_SIZE + 'rem',
      1: (FONT_SIZE * FONT_FACTOR) + 'rem',
      2: (FONT_SIZE * (Math.pow(FONT_FACTOR, 2))) + 'rem',
      3: (FONT_SIZE * (Math.pow(FONT_FACTOR, 3))) + 'rem',
      4: (FONT_SIZE * (Math.pow(FONT_FACTOR, 4))) + 'rem',
      5: (FONT_SIZE * (Math.pow(FONT_FACTOR, 5))) + 'rem',
      6: (FONT_SIZE * (Math.pow(FONT_FACTOR, 6))) + 'rem',
      7: (FONT_SIZE * (Math.pow(FONT_FACTOR, 7))) + 'rem',
      8: (FONT_SIZE * (Math.pow(FONT_FACTOR, 8))) + 'rem',
      9: (FONT_SIZE * (Math.pow(FONT_FACTOR, 9))) + 'rem',
      10: (FONT_SIZE * (Math.pow(FONT_FACTOR, 10))) + 'rem',
      11: (FONT_SIZE * (Math.pow(FONT_FACTOR, 11))) + 'rem',
      12: (FONT_SIZE * (Math.pow(FONT_FACTOR, 12))) + 'rem',
    },
    fontWeight: {
      100: '100',
      200: '200',
      300: '300',
      400: '400',
      500: '500',
      600: '600',
      700: '700',
      800: '800',
      900: '900',
    },

    lineHeight: {
      0: 0.75,
      1: 1,
      2: 1.25,
      3: 1.5,
      4: 1.75,
      5: 2,
    },

    maxHeight: (theme) => ({
      ...theme('spacing'),
      full: '100%',
      screen: '100vh',
    }),
    maxWidth: (theme, { breakpoints }) => ({
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      prose: '65ch',
      screen: '100vw',

      ...breakpoints(theme('screens')),
      ...theme('spacing'),
    }),
    minHeight: (theme) => ({
      ...theme('spacing'),
      full: '100%',
      screen: '100vh',
    }),
    minWidth: (theme) => ({
      ...theme('spacing'),
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      screen: '100vw',
    }),

    screens: {
      sm: '512px',
      md: '768px',
      lg: '1024px',
    },

    spacing: {
      none: '0px',
      px: '1px',
      0: '0px',
      0.125: '0.125rem',
      0.25: '0.25rem',
      0.375: '0.375rem',
      0.5: '0.5rem',
      0.625: '0.625rem',
      0.75: '0.75rem',
      0.875: '0.875rem',
      1: '1rem',
      1.25: '1.25rem',
      1.5: '1.5rem',
      1.75: '1.75rem',
      2: '2rem',
      2.5: '2rem',
      3: '3rem',
      4: '4rem',
      5: '5rem',
      6: '6rem',
      7: '7rem',
      8: '8rem',
      9: '9rem',
      10: '10rem',
      11: '11rem',
      12: '12rem',
      16: '16rem',
      20: '20rem',
      24: '24rem',
      32: '32rem',
      36: '36rem',
      40: '40rem',
      48: '48rem',
    },

    extend: {
      margin: (theme) => ({
        ...theme('spacing'),

        '-px': '1px',
        '-1': '-1rem',
        '-2': '-2rem',
        '-4': '-4rem',
        '-8': '-8rem',
      }),

      height: {
        font: '1em',
      },
      width: {
        font: '1em',
      },
    },
  },
}
