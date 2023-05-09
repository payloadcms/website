import type React from 'react'

export type Validate = undefined | ((value: unknown) => boolean | string)

export type Value = any // eslint-disable-line @typescript-eslint/no-explicit-any

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Value | Property | Property[]
}

export interface OnSubmit {
  ({
    data,
    unflattenedData,
    dispatchFields,
  }: {
    data: Property
    unflattenedData: Data
    dispatchFields: React.Dispatch<Action>
  }): void | Promise<void>
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

export interface RESET {
  type: 'RESET'
  payload: Fields
}

export interface REMOVE {
  type: 'REMOVE'
  path: string
}

export interface REMOVE_ROW {
  type: 'REMOVE_ROW'
  path: string
  rowIndex: number
}

export interface FieldWithPath extends Field {
  path: string
}

export interface UPDATE {
  type: 'UPDATE'
  payload: FieldWithPath | FieldWithPath[]
}

export type Action = RESET | REMOVE | REMOVE_ROW | UPDATE

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
  apiErrors?: Array<{
    field: string
    message: string
  }>
  submissionError?: string
}
