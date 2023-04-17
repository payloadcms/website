import type { Validate } from '../types'

export interface FieldProps<T> {
  path?: string
  required?: boolean
  validate?: Validate
  label?: string | React.ReactNode
  placeholder?: string
  onChange?: (value: T) => void // eslint-disable-line no-unused-vars
  initialValue?: T
  className?: string
  disabled?: boolean
  description?: string
  showError?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
  onClick?: () => void
}
