import type { HTMLAttributes } from 'react'

export interface Props {
  slug: string
  children: React.ReactNode
  className?: string
  title?: string
  description?: string
  header?: React.ReactNode

  size?: 's' | 'm' | 'l'
}

export type TogglerProps = HTMLAttributes<HTMLButtonElement> & {
  slug: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
}
