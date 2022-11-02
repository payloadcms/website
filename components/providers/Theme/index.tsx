import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { themeLocalStorageKey } from './shared'
import { Theme, themeIsValid, ThemePreferenceContextType } from './types'
import classes from './index.module.scss'

const ThemeContext = createContext<Theme | undefined>(undefined)

export const ThemeProvider: React.FC<{
  theme: Theme
  children: React.ReactNode
  className?: string
}> = ({ theme, children, className }) => {
  return (
    <ThemeContext.Provider value={theme}>
      <div
        className={[theme ? classes[`theme--${theme}`] : classes.loading, className]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export const useTheme = (): Theme => useContext(ThemeContext)

const initialContext: ThemePreferenceContextType = {
  theme: undefined,
  setTheme: () => null,
}

const ThemePreferenceContext = createContext(initialContext)

export const ThemePreferenceProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>()

  const setTheme = useCallback((themeToSet: Theme) => {
    setThemeState(themeToSet)
    window.localStorage.setItem(themeLocalStorageKey, themeToSet)
    document.documentElement.setAttribute('data-theme', themeToSet)
  }, [])

  useEffect(() => {
    let themeToSet: Theme = 'dark'
    const preference = window.localStorage.getItem(themeLocalStorageKey)

    if (themeIsValid(preference)) {
      themeToSet = preference
    }

    const mediaQuery = '(prefers-color-scheme: dark)'
    const mql = window.matchMedia(mediaQuery)
    const hasImplicitPreference = typeof mql.matches === 'boolean'

    if (hasImplicitPreference) {
      themeToSet = mql.matches ? 'dark' : 'light'
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
    setThemeState(themeToSet)
  }, [])

  return (
    <ThemePreferenceContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemePreferenceContext.Provider>
  )
}

export const useThemePreference = (): ThemePreferenceContextType =>
  useContext(ThemePreferenceContext)
