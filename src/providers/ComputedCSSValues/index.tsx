import * as React from 'react'
import { useResize } from '@utilities/use-resize'

interface IComputedCSSValues {
  gutterH: number
}
export const Context = React.createContext<IComputedCSSValues | undefined>(undefined)
export const useComputedCSSValues = (): IComputedCSSValues => {
  const context = React.useContext(Context)

  if (context === undefined) {
    throw new Error('useComputedCSSValues must be used within a ComputedCSSValuesProvider')
  }

  return context
}

type Props = {
  children: React.ReactNode
}
export const ComputedCSSValuesProvider: React.FC<Props> = ({ children }) => {
  const gutterRef = React.useRef(null)
  const resize = useResize(gutterRef)

  return (
    <Context.Provider
      value={{
        gutterH: resize.size?.width ?? 0,
      }}
    >
      {children}
      <div ref={gutterRef} style={{ width: `var(--gutter-h)` }} />
    </Context.Provider>
  )
}
