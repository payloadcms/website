import type { Validate, Value } from '../types'

export interface Options {
  path?: string // make optional so fields outside of a form can be used (no path)
  validate?: Validate
}

export type SetValue = (e: Value) => void

export interface FormField<FieldValue> {
  showError: boolean
  errorMessage?: string
  value: FieldValue
  debouncedValue: FieldValue
  formSubmitted: boolean
  formProcessing: boolean
  setValue: SetValue
}
