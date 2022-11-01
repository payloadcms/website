import type { Validate, Value } from '../types'

export interface Options {
  path?: string // make optional so fields outside of a form can be used (no path)
  validate?: Validate
}

export type SetValue = (e: Value) => void

export interface Field {
  showError: boolean
  errorMessage?: string
  value: string
  formSubmitted: boolean
  formProcessing: boolean
  setValue: SetValue
}
