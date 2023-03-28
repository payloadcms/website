import * as React from 'react'

import { Button } from '@components/Button'
import { TrashIcon } from '@root/icons/TrashIcon'
import { useArray } from './context'

import classes from './index.module.scss'

type ArrayRowProps = {
  children: React.ReactNode
  className?: string
  index: number
  allowRemove: boolean
}
export const ArrayRow: React.FC<ArrayRowProps> = props => {
  const { removeRow } = useArray()
  const { children, allowRemove, index, className } = props

  return (
    <div className={[className, classes.row].filter(Boolean).join(' ')}>
      <div className={classes.children}>{children}</div>

      {allowRemove && (
        <button type="button" onClick={() => removeRow(index)} className={classes.trashButton}>
          <TrashIcon />
        </button>
      )}
    </div>
  )
}

type AddRowProps = {
  className?: string
  label?: string
}
export const AddArrayRow: React.FC<AddRowProps> = ({ className, label = 'Add another' }) => {
  const { addRow } = useArray()

  return (
    <div className={[classes.addRowWrap, className].filter(Boolean).join(' ')}>
      <Button
        label={label}
        size="small"
        appearance="text"
        onClick={addRow}
        icon="plus"
        fullWidth={false}
        className={classes.addRowButton}
      />
    </div>
  )
}
