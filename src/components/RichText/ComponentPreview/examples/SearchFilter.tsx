'use client'

import { SearchFilter } from '@payloadcms/ui/elements/SearchFilter'
import { useState } from 'react'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const Demo = () => {
  const [search, setSearch] = useState('')
  return (
    <div className={classes.searchDemo}>
      <SearchFilter handleChange={(value) => setSearch(value || '')} label="Search posts" />
      <span aria-live="polite">Debounced value: {search || '—'}</span>
    </div>
  )
}

export const searchFilterExamples: ComponentExamples = {
  interactive: {
    code: `const [search, setSearch] = useState('')

<SearchFilter
  handleChange={(value) => setSearch(value || '')}
  label="Search posts"
/>`,
    render: () => <Demo />,
  },
}
