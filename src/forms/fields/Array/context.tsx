import * as React from 'react'

import { uuid } from '@root/utilities/uuid'

const ArrayContext = React.createContext<{
  addRow: () => void
  removeRow: (index: number) => void // eslint-disable-line no-unused-vars
  clearRows: () => void
  uuids: string[]
}>({
  addRow: () => {},
  removeRow: () => {},
  clearRows: () => {},
  uuids: [],
})

export const useArray = () => React.useContext(ArrayContext)

export const ArrayProvider: React.FC<{
  children: React.ReactNode
  instantiateEmpty?: boolean
}> = props => {
  const { children, instantiateEmpty } = props

  const [uuids, setUUIDs] = React.useState<string[]>(instantiateEmpty ? [] : [uuid()])

  const addRow = React.useCallback(() => {
    setUUIDs(prev => [...prev, uuid()])
  }, [])

  const removeRow = React.useCallback((index: number) => {
    setUUIDs(prev => {
      const remainingRows = prev.filter((_, i) => i !== index)
      return remainingRows.length > 0 ? remainingRows : [uuid()]
    })
  }, [])

  const clearRows = React.useCallback(() => {
    setUUIDs([uuid()])
  }, [])

  return (
    <ArrayContext.Provider
      value={{
        addRow,
        removeRow,
        clearRows,
        uuids,
      }}
    >
      {children}
    </ArrayContext.Provider>
  )
}
