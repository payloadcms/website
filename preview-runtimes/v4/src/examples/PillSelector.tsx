'use client'

import { PillSelector, type SelectablePill } from '@payloadcms/ui/elements/PillSelector'
import { useState } from 'react'

import type { PreviewExamples } from './types.js'

const InteractivePillSelector = () => {
  const [pills, setPills] = useState<SelectablePill[]>([
    { name: 'Posts', selected: true },
    { name: 'Media', selected: false },
    { name: 'Users', selected: true },
  ])

  return (
    <div className="payload-v4-preview__pill-selector">
      <PillSelector
        onClick={({ pill }) => {
          setPills((current) =>
            current.map((item) =>
              item.name === pill.name ? { ...item, selected: !item.selected } : item,
            ),
          )
        }}
        pills={pills}
      />
    </div>
  )
}

export const pillSelectorExamples: PreviewExamples = {
  interactive: <InteractivePillSelector />,
}
