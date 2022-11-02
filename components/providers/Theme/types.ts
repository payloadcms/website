export type Theme = 'light' | 'dark'

export interface ThemePreferenceContextType {
  theme: Theme
  setTheme: (theme: Theme) => void // eslint-disable-line no-unused-vars
}

export function themeIsValid(string: string): string is Theme {
  return ['light', 'dark'].includes(string)
}
