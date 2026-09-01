import type React from 'react'

export type ComponentExample = {
  code: string
  render: (context: { theme: 'dark' | 'light' }) => React.ReactNode
}

export type ComponentExamples = Record<string, ComponentExample>
