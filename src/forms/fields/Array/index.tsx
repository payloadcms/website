import { CircleIconButton } from '@components/CircleIconButton/index'
import { TrashIcon } from '@root/icons/TrashIcon/index'
import * as React from 'react'

import { useArray } from './context'
import classes from './index.module.scss'

type ArrayRowProps = {
  allowRemove: boolean
  children: React.ReactNode
  className?: string
  index: number
}
export const ArrayRow: React.FC<ArrayRowProps> = (props) => {
  const { removeRow } = useArray()
  const { allowRemove, children, className, index } = props

  return (
    <div className={[className, classes.row].filter(Boolean).join(' ')}>
      <div className={classes.children}>{children}</div>

      {allowRemove && (
        <button
          className={classes.trashButton}
          onClick={() => {
            removeRow(index)
          }}
          type="button"
        >
          <TrashIcon />
        </button>
      )}
    </div>
  )
}

type AddRowProps = {
  baseLabel?: string
  className?: string
  label?: string
  pluralLabel?: string
  singularLabel?: string
}

export const AddArrayRow: React.FC<AddRowProps> = ({
  baseLabel = 'Add',
  className,
  label: labelFromProps,
  pluralLabel = 'another',
  singularLabel = 'one',
}) => {
  const { addRow, uuids } = useArray()

  const label =
    labelFromProps ||
    (!uuids?.length ? `${baseLabel} ${pluralLabel}` : `${baseLabel} ${singularLabel}`)

  return <CircleIconButton className={className} label={label} onClick={addRow} />
}
