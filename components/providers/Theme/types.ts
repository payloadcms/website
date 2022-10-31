export type Theme = 'light' | 'dark'

export interface ThemePreferenceContextType {
  theme: Theme
  setTheme: (theme: Theme) => void // eslint-disable-line no-unused-vars
  autoMode: boolean
}
