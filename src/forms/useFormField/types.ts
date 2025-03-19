import type { Validate, Value } from '../types'

export interface Options {
  path?: string // make optional so fields outside of a form can be used (no path)
  validate?: Validate
}

export type SetValue = (e: Value) => void

export interface FormField<FieldValue> {
  debouncedValue: FieldValue
  errorMessage?: string
  formProcessing: boolean
  formSubmitted: boolean
  setValue: SetValue
  showError: boolean
  value: FieldValue
}
