import type { Validate } from '../types'

export interface FieldProps<T> {
  className?: string
  description?: string
  disabled?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  initialValue?: T
  label?: React.ReactNode | string
  name?: string
  onChange?: (value: T) => void
  onClick?: () => void
  path?: string
  placeholder?: string
  required?: boolean
  showError?: boolean
  validate?: Validate
}
