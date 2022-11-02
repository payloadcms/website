import type { Validate } from '../types'

export interface FieldProps<T> {
  path?: string
  required?: boolean
  validate?: Validate
  label?: string
  placeholder?: string
  onChange?: (value: T) => void // eslint-disable-line no-unused-vars
  initialValue?: T
  className?: string
}
