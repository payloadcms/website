'use client'

import React from 'react'

import { v3ComponentExamples } from './examples/index.js'

type PreviewTheme = 'dark' | 'light'

type Props = {
  component: string
  example: string
  theme: PreviewTheme
}

export { v3ComponentExamples }
export type { ComponentDesign, ComponentExample, ComponentExamples } from './examples/types.js'

export function PayloadV3Preview({ component, example, theme }: Props) {
  const preview = v3ComponentExamples[component]?.[example]?.render

  if (!preview) {
    return <p>Preview unavailable.</p>
  }

  return (
    <div className="payload-v3-preview" data-theme={theme}>
      {preview({ theme })}
    </div>
  )
}
