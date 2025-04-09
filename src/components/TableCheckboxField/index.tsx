'use client'
import type { TextFieldClientComponent } from 'payload'

import { TableIcon } from '@blocks/ComparisonTable/Icons'
import { useField } from '@payloadcms/ui'

import classes from './index.module.scss'

const TableCheckboxField: TextFieldClientComponent = ({ path }) => {
  const { setValue, value } = useField({ path })

  return (
    <button
      className={classes.toggle}
      data-checked={value}
      onClick={() => {
        setValue(!value)
      }}
      type="button"
    >
      <TableIcon checked={Boolean(value)} />
    </button>
  )
}

export default TableCheckboxField
