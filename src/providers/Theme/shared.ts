import type { Theme } from './types'

export const themeLocalStorageKey = 'payload-theme'

export const defaultTheme = 'light'

export const getImplicitPreference = (): null | Theme => {
  const mediaQuery = '(prefers-color-scheme: dark)'
  const mql = window.matchMedia(mediaQuery)
  const hasImplicitPreference = typeof mql.matches === 'boolean'

  if (hasImplicitPreference) {
    return mql.matches ? 'dark' : 'light'
  }

  return null
}
