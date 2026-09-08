'use client'

import React from 'react'

import './datePicker.scss'
import { ComponentPreviewUI } from './ComponentPreviewUI'
import { v3ComponentExamples } from './examples'

type Props = {
  component: string
  example: string
  version?: string
}

export const V3ComponentPreview: React.FC<Props> = ({ component, example, version }) => {
  const selectedExample = v3ComponentExamples[component]?.[example]

  return (
    <ComponentPreviewUI
      isV4Preview={false}
      renderPreview={(theme) => selectedExample?.render?.({ theme })}
      selectedExample={selectedExample}
      version={version}
    />
  )
}
