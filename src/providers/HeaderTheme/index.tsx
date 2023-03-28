import React, { createContext, useContext } from 'react'

export type HeaderColors = 'light' | 'dark'

type Type = {
  headerColor?: HeaderColors | null
  setHeaderColor: (color?: HeaderColors | null) => void // eslint-disable-line no-unused-vars
  debug?: boolean
}
export const HeaderThemeContext = createContext<Type>({
  headerColor: undefined,
  setHeaderColor: () => null,
  debug: false,
})
export const useHeaderTheme = (): Type => useContext(HeaderThemeContext)

const HeaderThemeProvider: React.FC<{
  children: React.ReactNode
  debug?: boolean
}> = ({ children, debug }) => {
  const [headerColor, setHeaderColor] = React.useState<HeaderColors | null | undefined>(undefined)

  return (
    <HeaderThemeContext.Provider
      value={{
        debug,
        headerColor,
        setHeaderColor,
      }}
    >
      {children}
    </HeaderThemeContext.Provider>
  )
}

export default HeaderThemeProvider
