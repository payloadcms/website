import type JSX from 'react'

export type AllowedElements = Extract<
  // @ts-expect-error
  keyof JSX.IntrinsicElements,
  'h1' | 'h2' | 'h3' | 'p' | 'span'
>
