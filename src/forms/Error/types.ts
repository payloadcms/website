import type { HTMLAttributes } from 'react'

export interface Props extends HTMLAttributes<HTMLParagraphElement> {
  message: string | undefined
  showError: boolean
}
