'use client'

import React from 'react'

import { v4ComponentExamples } from './examples/index.js'
import { PreviewProviders } from './PreviewProviders.js'

type PreviewTheme = 'dark' | 'light'

type Props = {
  component: string
  example: string
  theme: PreviewTheme
}

export { v4ComponentExamples }
export type { ComponentDesign, ComponentExample, ComponentExamples } from './examples/types.js'

export function PayloadV4Preview({ component, example, theme }: Props) {
  const preview = v4ComponentExamples[component]?.[example]?.render

  if (!preview) {
    return <p>Preview unavailable.</p>
  }

  return (
    <PreviewProviders>
      <div className="payload-v4-preview" data-theme={theme}>
        {preview({ theme })}
      </div>
    </PreviewProviders>
  )
}
