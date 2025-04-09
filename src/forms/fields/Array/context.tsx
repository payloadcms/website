import { uuid } from '@root/utilities/uuid'
import * as React from 'react'

const ArrayContext = React.createContext<{
  addRow: () => void
  clearRows: () => void
  removeRow: (index: number) => void
  uuids: string[]
}>({
  addRow: () => {},
  clearRows: () => {},
  removeRow: () => {},
  uuids: [],
})

export const useArray = () => React.use(ArrayContext)

export const ArrayProvider: React.FC<{
  children: React.ReactNode
  clearCount?: number // increment this to clear the array
  instantiateEmpty?: boolean
}> = (props) => {
  const { children, clearCount, instantiateEmpty } = props

  const [uuids, setUUIDs] = React.useState<string[]>(instantiateEmpty ? [] : [uuid()])

  const addRow = React.useCallback(() => {
    setUUIDs((prev) => [...prev, uuid()])
  }, [])

  const removeRow = React.useCallback(
    (index: number) => {
      setUUIDs((prev) => {
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
    <ArrayContext
      value={{
        addRow,
        clearRows,
        removeRow,
        uuids,
      }}
    >
      {children}
    </ArrayContext>
  )
}
