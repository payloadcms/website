import type React from 'react'

export type Validate = ((value: unknown) => boolean | string) | undefined

export type Value = any // eslint-disable-line @typescript-eslint/no-explicit-any

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[] | Value
}

export interface OnSubmit {
  ({
    data,
    dispatchFields,
    unflattenedData,
  }: {
    data: Property
    dispatchFields: React.Dispatch<Action>
    unflattenedData: Data
  }): Promise<void> | void
}

export interface Field {
  errorMessage?: string
  initialValue?: Value
  valid?: boolean
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
  payload: Fields
  type: 'RESET'
}

export interface REMOVE {
  path: string
  type: 'REMOVE'
}

export interface REMOVE_ROW {
  path: string
  rowIndex: number
  type: 'REMOVE_ROW'
}

export interface FieldWithPath extends Field {
  path: string
}

export interface UPDATE {
  payload: FieldWithPath | FieldWithPath[]
  type: 'UPDATE'
}

export type Action = REMOVE | REMOVE_ROW | RESET | UPDATE

export interface IFormContext {
  apiErrors?: Array<{
    field: string
    message: string
  }>
  dispatchFields: React.Dispatch<Action>
  fields: Fields
  getField: (path: string) => Field | undefined
  getFields: () => Fields
  getFormData?: () => Data
  handleSubmit?: (e: React.ChangeEvent<HTMLFormElement>) => false | Promise<boolean> | void
  initialState: InitialState
  setHasSubmitted: (submitted: boolean) => void
  setIsModified: (modified: boolean) => void
  setIsProcessing: (processing: boolean) => void
  submissionError?: string
  validateForm: () => boolean
}
