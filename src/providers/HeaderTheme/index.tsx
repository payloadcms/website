import React, { createContext, useContext } from 'react'

export type HeaderColors = 'light' | 'dark'

type Type = {
  headerColor?: HeaderColors | null
  setHeaderColor: (color?: HeaderColors | null) => void // eslint-disable-line no-unused-vars
  debug?: boolean
  setIsFirstObserver: (isFirst: boolean) => void // eslint-disable-line no-unused-vars
  isFirstObserver: boolean
}
export const HeaderThemeContext = createContext<Type>({
  headerColor: undefined,
  setHeaderColor: () => null,
  debug: false,
  setIsFirstObserver: () => null,
  isFirstObserver: true,
})
export const useHeaderTheme = (): Type => useContext(HeaderThemeContext)

const HeaderThemeProvider: React.FC<{
  children: React.ReactNode
  debug?: boolean
}> = ({ children, debug }) => {
  const [isFirstObserver, setIsFirstObserver] = React.useState(true)
  const [headerColor, setHeaderColor] = React.useState<HeaderColors | null | undefined>(undefined)

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
