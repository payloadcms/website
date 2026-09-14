'use client'

import { PillSelector, type SelectablePill } from '@payloadcms/ui/elements/PillSelector'
import { useState } from 'react'

import type { ComponentRenders } from './types'

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

export const pillSelectorExamples: ComponentRenders = {
  interactive: {
    render: () => <Demo />,
  },
}
