import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { Theme, themeIsValid, ThemePreferenceContextType } from './types'
import classes from './index.module.scss'

const ThemeContext = createContext<Theme | null | undefined>(undefined)

export const ThemeProvider: React.FC<{
  theme?: Theme | null
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

export const useTheme = (): Theme | null | undefined => useContext(ThemeContext)

const initialContext: ThemePreferenceContextType = {
  theme: undefined,
  setTheme: () => null,
}

const ThemePreferenceContext = createContext(initialContext)

export const ThemePreferenceProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme | null>(null)

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
      const implicitPreference = getImplicitPreference()
      document.documentElement.setAttribute('data-theme', implicitPreference || '')
      setThemeState(implicitPreference)
    } else {
      setThemeState(themeToSet)
      window.localStorage.setItem(themeLocalStorageKey, themeToSet)
      document.documentElement.setAttribute('data-theme', themeToSet)
    }
  }, [])

  useEffect(() => {
    let themeToSet: Theme = defaultTheme
    const preference = window.localStorage.getItem(themeLocalStorageKey)

    if (themeIsValid(preference)) {
      themeToSet = preference
    } else {
      const implicitPreference = getImplicitPreference()

      if (implicitPreference) {
        themeToSet = implicitPreference
      }
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
