import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { themeLocalStorageKey } from './shared'
import { Theme, ThemePreferenceContextType } from './types'
import classes from './index.module.scss'

const ThemeContext = createContext<Theme | undefined>(undefined)

export const ThemeProvider: React.FC<{
  theme: Theme
  children: React.ReactNode
  className?: string
}> = ({ theme, children, className }) => {
  return (
    <ThemeContext.Provider value={theme}>
      <div className={[classes[`theme--${theme}`], className].filter(Boolean).join(' ')}>
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
    setThemeState(document.documentElement.getAttribute('data-theme') as Theme)
  }, [])

  return (
    <ThemePreferenceContext.Provider value={{ theme, setTheme }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemePreferenceContext.Provider>
  )
}

export const useThemePreference = (): ThemePreferenceContextType =>
  useContext(ThemePreferenceContext)
