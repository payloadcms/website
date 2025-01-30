export type Theme = 'dark' | 'light'

export interface ThemePreferenceContextType {
  setTheme: (theme: null | Theme) => void
  theme?: null | Theme
}

export function themeIsValid(string: null | string): string is Theme {
  return string ? ['dark', 'light'].includes(string) : false
}
