import type { HTMLAttributes } from 'react'

export interface Props extends HTMLAttributes<HTMLLabelElement> {
  actionsClassName?: string
  label?: string | React.ReactNode
  required?: boolean
  actionsSlot?: React.ReactNode
  htmlFor?: string
  margin?: boolean
}
