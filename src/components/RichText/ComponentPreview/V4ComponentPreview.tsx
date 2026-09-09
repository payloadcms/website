'use client'

import { PayloadV4Preview } from '@payloadcms/v4-preview-runtime'
import React from 'react'

import { ComponentPreviewUI } from './ComponentPreviewUI'
import { v4ComponentExamples } from './examples/v4'

type Props = {
  component: string
  example: string
  version?: string
}

export const V4ComponentPreview: React.FC<Props> = ({ component, example, version }) => {
  const selectedExample = v4ComponentExamples[component]?.[example]

  return (
    <ComponentPreviewUI
      isV4Preview
      renderPreview={(theme) => (
        <PayloadV4Preview component={component} example={example} theme={theme} />
      )}
      selectedExample={selectedExample}
      version={version}
    />
  )
}
