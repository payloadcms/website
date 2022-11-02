export const themeLocalStorageKey = 'payload-theme'

export const setInitialTheme = `(function() {
  // function getInitialTheme() {
  //   const preference = window.localStorage.getItem('${themeLocalStorageKey}')

  //   if (typeof preference === 'string') {
  //     return preference
  //   }

  //   const mediaQuery = '(prefers-color-scheme: dark)'
  //   const mql = window.matchMedia(mediaQuery)
  //   const hasImplicitPreference = typeof mql.matches === 'boolean'

  //   if (hasImplicitPreference) {
  //     return mql.matches ? 'dark' : 'light'
  //   }

  //   return 'light'
  // }

  // const theme = getInitialTheme()
  // document.documentElement.setAttribute('data-theme', theme)
})()
`
