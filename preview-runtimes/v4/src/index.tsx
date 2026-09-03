'use client'

import { Button } from '@payloadcms/ui/elements/Button'
import React from 'react'

type PreviewTheme = 'dark' | 'light'

type Props = {
  component: string
  example: string
  theme: PreviewTheme
}

const examples: Record<string, Record<string, React.ReactNode>> = {
  Button: {
    primary: <Button margin={false}>Save changes</Button>,
  },
}

export function PayloadV4Preview({ component, example, theme }: Props) {
  const preview = examples[component]?.[example]

  if (!preview) {
    return <p>Preview unavailable.</p>
  }

  return (
    <div className="payload-v4-preview" data-theme={theme}>
      {preview}
    </div>
  )
}
