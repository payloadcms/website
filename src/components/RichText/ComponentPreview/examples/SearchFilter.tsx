'use client'

import { SearchBar } from '@payloadcms/ui/elements/SearchBar'
import { useState } from 'react'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const Demo = () => {
  const [search, setSearch] = useState('')
  return (
    <div className={classes.searchDemo}>
      <SearchBar label="Search posts" onSearchChange={(value) => setSearch(value || '')} />
      <span aria-live="polite">Debounced value: {search || '—'}</span>
    </div>
  )
}

export const searchFilterExamples: ComponentExamples = {
  interactive: {
    code: `const [search, setSearch] = useState('')

<SearchBar
  label="Search posts"
  onSearchChange={(value) => setSearch(value || '')}
/>`,
    render: () => <Demo />,
  },
}
