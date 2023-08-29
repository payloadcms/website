import type { HTMLAttributes } from 'react'

export interface Props extends HTMLAttributes<HTMLLabelElement> {
  label?: string | React.ReactNode
  required?: boolean
  actionsSlot?: React.ReactNode
  htmlFor?: string
  margin?: boolean
}
