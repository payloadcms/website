import type React from 'react'
import type { Option } from './fields/RadioGroup'

export type Validate = undefined | ((value: unknown, options?: unknown) => boolean | string)

export type Value = string | number | boolean | string[] | Option | Option[]

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Value | Property | Property[]
}

export interface OnSubmit {
  (data: Property, unflattenedData: Data): void | Promise<void>
}

export interface Field {
  valid?: boolean
  initialValue?: Value
  errorMessage?: string
  value?: Value
}

export interface InitialState {
  [key: string]: Field
}

export interface Fields {
  [key: string]: Field
}

export interface SetModified {
  (modified: boolean): void
}

export interface SetProcessing {
  (processing: boolean): void
}

export interface SetSubmitted {
  (submitted: boolean): void
}

interface REPLACE_STATE {
  type: 'REPLACE_STATE'
  state: Fields
}

interface REMOVE {
  type: 'REMOVE'
  path: string
}

interface REMOVE_ROW {
  type: 'REMOVE_ROW'
  path: string
  rowIndex: number
}

interface UPDATE {
  type: 'UPDATE'
  path: string
  value: Value
  initialValue?: Value
  errorMessage?: string
  valid: boolean
}

export type Action = REPLACE_STATE | REMOVE | REMOVE_ROW | UPDATE

export interface IFormContext {
  initialState: InitialState
  fields: Fields
  validateForm: () => boolean
  handleSubmit?: (e: React.ChangeEvent<HTMLFormElement>) => Promise<boolean> | void | false
  getFields: () => Fields
  getField: (path: string) => Field | undefined
  getFormData?: () => Data
  dispatchFields: React.Dispatch<Action>
  setIsModified: (modified: boolean) => void
  setIsProcessing: (processing: boolean) => void
  setHasSubmitted: (submitted: boolean) => void
}
