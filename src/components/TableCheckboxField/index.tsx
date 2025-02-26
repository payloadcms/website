'use client'
import type { TextFieldClientComponent } from 'payload'
import { useField } from '@payloadcms/ui'

import classes from './index.module.scss'
import { TableIcon } from '@blocks/ComparisonTable/Icons'

const TableCheckboxField: TextFieldClientComponent = ({ path }) => {
  const { value, setValue } = useField({ path })

  return (
    <button
      type="button"
      onClick={() => {
        setValue(!value)
      }}
      className={classes.toggle}
      data-checked={value}
    >
      <TableIcon checked={Boolean(value)} />
    </button>
  )
}

export default TableCheckboxField
