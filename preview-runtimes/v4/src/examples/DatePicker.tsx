'use client'

import { DatePicker } from '@payloadcms/ui'
import { useState } from 'react'

import type { PreviewExamples } from './types.js'

const DatePickerDemo = () => {
  const [value, setValue] = useState<Date>()

  return (
    <div className="payload-v4-preview__date-picker">
      <label htmlFor="v4-component-preview-date">Date</label>
      <DatePicker
        onChange={setValue}
        overrides={{ id: 'v4-component-preview-date' }}
        placeholder="Select a date"
        value={value}
      />
    </div>
  )
}

export const datePickerExamples: PreviewExamples = {
  basic: <DatePickerDemo />,
}
