import React, { createContext, useContext } from 'react'

type Colors = 'light' | 'dark'

type Type = {
  headerColor: Colors
  setHeaderColor: (color: Colors) => void // eslint-disable-line no-unused-vars
  debug?: boolean
  setIsFirstObserver: (isFirst: boolean) => void // eslint-disable-line no-unused-vars
  isFirstObserver: boolean
}
export const HeaderThemeContext = createContext<Type>({
  headerColor: undefined,
  setHeaderColor: undefined,
  debug: false,
  setIsFirstObserver: undefined,
  isFirstObserver: true,
})
export const useHeaderTheme = (): Type => useContext(HeaderThemeContext)

const HeaderThemeProvider: React.FC<{
  children: React.ReactNode
  debug?: boolean
}> = ({ children, debug }) => {
  const [headerColor, setHeaderColor] = React.useState<Colors>()
  const [isFirstObserver, setIsFirstObserver] = React.useState(true)

  return (
    <HeaderThemeContext.Provider
      value={{
        debug,
        headerColor,
        setHeaderColor,
        isFirstObserver,
        setIsFirstObserver,
      }}
    >
      {children}
    </HeaderThemeContext.Provider>
  )
}

export default HeaderThemeProvider
