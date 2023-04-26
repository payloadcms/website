import type { HTMLAttributes } from 'react'

export interface Props extends HTMLAttributes<HTMLParagraphElement> {
  showError: boolean
  message: string | undefined
}
