'use client'

import { type Option, ReactSelect } from '@payloadcms/ui/elements/ReactSelect'
import { useState } from 'react'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'

const options: Option<string>[] = [
  { label: 'Draft', value: 'draft' },
  { label: 'Published', value: 'published' },
  { label: 'Archived', value: 'archived' },
]

const collectionOptions: Option<string>[] = [
  { label: 'Posts', value: 'posts' },
  { label: 'Media', value: 'media' },
  { label: 'Pages', value: 'pages' },
  { label: 'Users', value: 'users' },
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

const MultipleDemo = () => {
  const [value, setValue] = useState<Option<string>[]>(collectionOptions.slice(0, 2))

  return (
    <div className={classes.reactSelectDemo}>
      <ReactSelect
        isMulti
        isSortable
        onChange={(nextValue) => setValue(nextValue as Option<string>[])}
        options={collectionOptions}
        placeholder="Select collections"
        value={value}
      />
    </div>
  )
}

export const reactSelectExamples: ComponentRenders = {
  basic: {
    render: () => <Demo />,
  },
  multiple: {
    render: () => <MultipleDemo />,
  },
}
