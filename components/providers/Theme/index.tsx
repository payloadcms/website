import React, { createContext, useCallback, useContext, useState } from 'react'
import canUseDOM from '../../../utilities/can-use-dom'
import { getCookie } from '../../../utilities/get-cookie'
import { themeCookieName } from './shared'
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
  theme: 'light',
  setTheme: () => null,
  autoMode: true,
}

const ThemePreferenceContext = createContext(initialContext)

export const ThemePreferenceProvider: React.FC<{ children?: React.ReactNode; theme: Theme }> = ({
  children,
  theme: initialTheme,
}) => {
  const [theme, setThemeState] = useState(initialTheme)
  const [autoMode, setAutoMode] = useState(() => {
    const themeFromCookie = canUseDOM ? getCookie(themeCookieName) : undefined
    return !themeFromCookie
  })

  const setTheme = useCallback((themeToSet: Theme | 'auto') => {
    if (themeToSet === 'light' || themeToSet === 'dark') {
      setThemeState(themeToSet)
      setAutoMode(false)
      document.cookie = `${themeCookieName}=${themeToSet}`
      document.documentElement.setAttribute('data-theme', themeToSet)
    } else if (themeToSet === 'auto') {
      const existingThemeFromCookie = getCookie(themeCookieName)

      if (existingThemeFromCookie) {
        document.cookie = `${themeCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`
      }

      const themeFromOS =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'

      document.documentElement.setAttribute('data-theme', themeFromOS)
      setAutoMode(true)
      setThemeState(themeFromOS)
    }
  }, [])

  return (
    <ThemePreferenceContext.Provider value={{ theme, setTheme, autoMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemePreferenceContext.Provider>
  )
}

export const useThemePreference = (): ThemePreferenceContextType =>
  useContext(ThemePreferenceContext)
