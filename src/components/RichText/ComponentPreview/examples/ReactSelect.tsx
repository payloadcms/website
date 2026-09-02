'use client'

import { type Option, ReactSelect } from '@payloadcms/ui/elements/ReactSelect'
import { useState } from 'react'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const options: Option<string>[] = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
]

const Demo = () => {
  const [value, setValue] = useState<Option<string>>(options[0])
  return (
    <div className={classes.reactSelectDemo}>
      <ReactSelect
        isClearable={false}
        onChange={(nextValue) => setValue(nextValue as Option<string>)}
        options={options}
        placeholder="Select a status"
        value={value}
      />
    </div>
  )
}

export const reactSelectExamples: ComponentExamples = {
  basic: {
    code: `const options = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
]

const [value, setValue] = useState(options[0])

<ReactSelect
  isClearable={false}
  onChange={setValue}
  options={options}
  placeholder="Select a status"
  value={value}
/>`,
    render: () => <Demo />,
  },
}
