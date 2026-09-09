'use client'

import { type Option, ReactSelect } from '@payloadcms/ui/elements/ReactSelect'
import { useState } from 'react'

import type { PreviewExamples } from './types.js'

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

const BasicReactSelect = () => {
  const [value, setValue] = useState<Option<string>>(options[0])

  return (
    <div className="payload-v4-preview__react-select">
      <ReactSelect
        aria-label="Status"
        isClearable={false}
        menuPortalTarget={null}
        onChange={(nextValue) => setValue(nextValue as Option<string>)}
        options={options}
        placeholder="Select a status"
        value={value}
      />
    </div>
  )
}

const MultiReactSelect = () => {
  const [value, setValue] = useState<Option<string>[]>(collectionOptions.slice(0, 2))

  return (
    <div className="payload-v4-preview__react-select">
      <ReactSelect
        aria-label="Collections"
        isMulti
        isSortable
        menuPortalTarget={null}
        onChange={(nextValue) => setValue(nextValue as Option<string>[])}
        options={collectionOptions}
        placeholder="Select collections"
        value={value}
      />
    </div>
  )
}

export const reactSelectExamples: PreviewExamples = {
  basic: <BasicReactSelect />,
  multiple: <MultiReactSelect />,
}
