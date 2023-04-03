import type { HTMLAttributes } from 'react'

export interface Props {
  slug: string
  children: React.ReactNode
  className?: string
  title?: string
  header?: React.ReactNode
}

export type TogglerProps = HTMLAttributes<HTMLButtonElement> & {
  slug: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}
