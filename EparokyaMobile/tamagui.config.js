import { createTamagui } from '@tamagui/core'

const config = createTamagui({
  tokens: {
    size: {
      sm: 8,
      md: 12,
      lg: 20,
    },
    space: {
      sm: 8,
      md: 12,
      lg: 20,
    },
    radius: {
      none: 0,
      sm: 3,
    },
    color: {
      white: '#fff',
      black: '#000',
    },
  },

  themes: {
    light: {
      bg: '#f2f2f2',
      color: '#000',
    },
    dark: {
      bg: '#111',
      color: '#fff',
    },
  },

  media: {
    sm: { maxWidth: 860 },
    gtSm: { minWidth: 861 },
    short: { maxHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },

  shorthands: {
    px: 'paddingHorizontal',
  },

  settings: {
    disableSSR: true,
    // allowedStyleValues: 'somewhat-strict-web', // comment this if you're targeting React Native only
  },
})

export default config
