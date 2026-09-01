import type React from 'react'

export type ComponentDesign = {
  code: string
  description: string
  variables: Array<{
    description: string
    name: string
  }>
}

export type ComponentExample = {
  code: string
  design?: ComponentDesign
  render: (context: { theme: 'dark' | 'light' }) => React.ReactNode
}

export type ComponentExamples = Record<string, ComponentExample>
