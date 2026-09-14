'use client'

import { DatePicker } from '@payloadcms/ui'
import { useState } from 'react'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'

const Demo = () => {
  const [value, setValue] = useState<Date>()

  return (
    <div className={classes.datePickerDemo}>
      <label htmlFor="component-preview-date">Date</label>
      <DatePicker
        id="component-preview-date"
        onChange={(date) => setValue(date || undefined)}
        placeholder="Select a date"
        value={value}
      />
    </div>
  )
}

export const datePickerExamples: ComponentRenders = {
  basic: {
    render: () => <Demo />,
  },
}
