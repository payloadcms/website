import type React from 'react'

export type ComponentDesign = {
  code: string
  description: string
  variables: Array<{
    description: string
    name: string
  }>
}

export type ComponentExampleDocumentation = {
  code: string
  design: ComponentDesign
}

export type ComponentRender = {
  render: (context: { theme: 'dark' | 'light' }) => React.ReactNode
}

export type ComponentExample = ComponentExampleDocumentation & ComponentRender

export type ComponentDocumentation = Record<string, ComponentExampleDocumentation>
export type ComponentExamples = Record<string, ComponentExample>
export type ComponentRenders = Record<string, ComponentRender>
