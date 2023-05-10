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
  clearCount?: number // increment this to clear the array
}> = props => {
  const { children, instantiateEmpty, clearCount } = props

  const [uuids, setUUIDs] = React.useState<string[]>(instantiateEmpty ? [] : [uuid()])

  const addRow = React.useCallback(() => {
    setUUIDs(prev => [...prev, uuid()])
  }, [])

  const removeRow = React.useCallback(
    (index: number) => {
      setUUIDs(prev => {
        const initialRows = (instantiateEmpty ? [] : [uuid()]) as string[]
        const remainingRows = prev.filter((_, i) => i !== index)
        return remainingRows.length > 0 ? remainingRows : initialRows
      })
    },
    [instantiateEmpty],
  )

  const clearRows = React.useCallback(() => {
    setUUIDs(instantiateEmpty ? [] : [uuid()])
  }, [instantiateEmpty])

  React.useEffect(() => {
    if (typeof clearCount === 'number' && clearCount > 0) {
      clearRows()
    }
  }, [clearCount, clearRows])

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
