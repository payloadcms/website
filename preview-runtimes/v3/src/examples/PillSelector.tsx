'use client'

import { PillSelector, type SelectablePill } from '@payloadcms/ui/elements/PillSelector'
import { useState } from 'react'

import type { ComponentExamples } from './types'

const Demo = () => {
  const [pills, setPills] = useState<SelectablePill[]>([
    { name: 'Posts', selected: true },
    { name: 'Media', selected: false },
    { name: 'Users', selected: true },
  ])
  return (
    <PillSelector
      onClick={({ pill }) =>
        setPills((current) =>
          current.map((item) =>
            item.name === pill.name ? { ...item, selected: !item.selected } : item,
          ),
        )
      }
      pills={pills}
    />
  )
}

export const pillSelectorExamples: ComponentExamples = {
  interactive: {
    code: `const [pills, setPills] = useState([
  { name: 'Posts', selected: true },
  { name: 'Media', selected: false },
])

<PillSelector
  pills={pills}
  onClick={({ pill }) => {
    setPills(current => current.map(item =>
      item.name === pill.name ? { ...item, selected: !item.selected } : item
    ))
  }}
/>`,
    render: () => <Demo />,
  },
}
