import React, { createContext, useContext } from 'react'

type Colors = 'light' | 'dark'

type Type = {
  headerColor: Colors
  setHeaderColor: (color: Colors) => void // eslint-disable-line no-unused-vars
  debug?: boolean
}
export const HeaderThemeContext = createContext<Type>({
  headerColor: 'light',
  setHeaderColor: undefined,
  debug: false,
})
export const useHeaderTheme = (): Type => useContext(HeaderThemeContext)

const HeaderThemeProvider: React.FC<{
  initialColor?: Colors
  children: React.ReactNode
  debug?: boolean
}> = ({ children, initialColor, debug }) => {
  const [headerColor, setHeaderColor] = React.useState<Colors>(initialColor)

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
