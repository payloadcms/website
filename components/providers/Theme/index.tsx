import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import canUseDOM from '../../../utilities/can-use-dom'
import classes from './index.module.scss'

export type Theme = 'light' | 'dark'

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

export type ThemePreferenceContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void // eslint-disable-line no-unused-vars
  autoMode: boolean
}

const initialContext: ThemePreferenceContextType = {
  theme: 'light',
  setTheme: () => null,
  autoMode: true,
}

const ThemePreferenceContext = createContext(initialContext)

const localStorageKey = 'payload-theme'

const getTheme = () => {
  let theme: Theme = 'dark'

  const themeFromStorage = window.localStorage.getItem(localStorageKey)

  if (themeFromStorage === 'light' || themeFromStorage === 'dark') {
    theme = themeFromStorage
  } else {
    theme =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
  }

  document.documentElement.setAttribute('data-theme', theme)

  return theme
}

export const ThemePreferenceProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [autoMode, setAutoMode] = useState(() => {
    const themeFromStorage = canUseDOM ? window.localStorage.getItem(localStorageKey) : undefined
    return !themeFromStorage
  })

  const setTheme = useCallback((themeToSet: Theme | 'auto') => {
    if (themeToSet === 'light' || themeToSet === 'dark') {
      setThemeState(themeToSet)
      setAutoMode(false)
      window.localStorage.setItem(localStorageKey, themeToSet)
      document.documentElement.setAttribute('data-theme', themeToSet)
    } else if (themeToSet === 'auto') {
      const existingThemeFromStorage = window.localStorage.getItem(localStorageKey)
      if (existingThemeFromStorage) window.localStorage.removeItem(localStorageKey)
      const themeFromOS =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      document.documentElement.setAttribute('data-theme', themeFromOS)
      setAutoMode(true)
      setThemeState(themeFromOS)
    }
  }, [])

  useEffect(() => {
    setThemeState(getTheme())
  }, [])

  return (
    <ThemePreferenceContext.Provider value={{ theme, setTheme, autoMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemePreferenceContext.Provider>
  )
}

export const useThemePreference = (): ThemePreferenceContextType =>
  useContext(ThemePreferenceContext)
