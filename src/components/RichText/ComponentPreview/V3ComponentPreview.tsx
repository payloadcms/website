'use client'

import { PayloadV3Preview, v3ComponentExamples } from '@payloadcms/v3-preview-runtime'
import React from 'react'

import { ComponentPreviewUI } from './ComponentPreviewUI'

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
      renderPreview={(theme) => (
        <PayloadV3Preview component={component} example={example} theme={theme} />
      )}
      selectedExample={selectedExample}
      version={version}
    />
  )
}
