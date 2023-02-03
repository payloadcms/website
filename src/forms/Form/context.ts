'use client'

import { createContext, useContext } from 'react'

import type { IFormContext } from '../types'
import initialContext from './initialContext'

const FormContext = createContext(initialContext)
const FieldContext = createContext(initialContext)
const FormSubmittedContext = createContext(false)
const ProcessingContext = createContext(false)
const ModifiedContext = createContext(false)

const useForm = (): IFormContext => useContext(FormContext)
const useFormFields = (): IFormContext => useContext(FieldContext)
const useFormSubmitted = (): boolean => useContext(FormSubmittedContext)
const useFormProcessing = (): boolean => useContext(ProcessingContext)
const useFormModified = (): boolean => useContext(ModifiedContext)

export {
  FieldContext,
  FormContext,
  FormSubmittedContext,
  ModifiedContext,
  ProcessingContext,
  useForm,
  useFormFields,
  useFormModified,
  useFormProcessing,
  useFormSubmitted,
}
