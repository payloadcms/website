import type { HTMLAttributes } from 'react'

export interface Props extends HTMLAttributes<HTMLLabelElement> {
  actionsClassName?: string
  actionsSlot?: React.ReactNode
  htmlFor?: string
  label?: React.ReactNode | string
  margin?: boolean
  required?: boolean
}
