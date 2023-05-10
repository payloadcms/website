'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useDebounce from '@utilities/use-debounce'

import { useForm, useFormModified, useFormProcessing, useFormSubmitted } from '../Form/context'
import { FieldWithPath, Value } from '../types'
import { FormField, SetValue } from './types'

// this hook:
// 1. reports that the form has been modified
// 2. debounces its value and sends it to the form context
// 3. runs field-level validation
// 4. returns form state and field-level errors
export const useFormField = <T extends Value>(options): FormField<T> => {
  const { path, validate, initialValue: initialValueFromProps, required } = options

  const formContext = useForm()
  const submitted = useFormSubmitted()
  const processing = useFormProcessing()
  const modified = useFormModified()
  const wasSubmittedRef = useRef(false)

  const { dispatchFields, getField, setIsModified, apiErrors } = formContext

  // Get field by path
  const field = getField(path)

  const fieldExists = Boolean(field)

  const initialValue = field?.initialValue || initialValueFromProps

  const [internalValue, setInternalValue] = useState<Value>(initialValue)

  // Debounce internal values to update form state only every 60ms
  const debouncedValue = useDebounce(internalValue, 120)

  // Valid could be a string equal to an error message

  const validFromContext = field && typeof field.valid === 'boolean' ? field.valid : true
  const apiError = Array.isArray(apiErrors)
    ? apiErrors?.find(error => error.field === path)
    : undefined
  const validFromAPI = apiError === undefined
  const showError = (validFromContext === false || validFromAPI === false) && submitted

  // Method to send update field values from field component(s)
  // Should only be used internally
  const sendField = useCallback(
    async (valueToSend?: Value) => {
      if (valueToSend === undefined) {
        return
      }

      const fieldToDispatch: FieldWithPath = {
        path,
        value: valueToSend,
        valid: true,
      }

      const validationResult = typeof validate === 'function' ? await validate(valueToSend) : true

      if (typeof validationResult === 'string' || validationResult === false) {
        fieldToDispatch.errorMessage = validationResult
        fieldToDispatch.valid = false
      }

      fieldToDispatch.initialValue = initialValue

      dispatchFields({
        type: 'UPDATE',
        payload: fieldToDispatch,
      })
    },
    [path, dispatchFields, validate, initialValue],
  )

  // NOTE: 'internalValue' is NOT debounced
  const setValue = useCallback<SetValue>(
    val => {
      if (!modified) {
        setIsModified(true)
      }

      setInternalValue(val)
    },
    [setIsModified, modified],
  )

  useEffect(() => {
    if (initialValue !== undefined) {
      setInternalValue(initialValue)
    }
  }, [initialValue])

  // re-sync state with field.value after submission (field could have been reset)
  useEffect(() => {
    if (submitted) {
      wasSubmittedRef.current = true
    } else if (!submitted && wasSubmittedRef.current) {
      wasSubmittedRef.current = false
      setInternalValue(field?.value)
    }
  }, [submitted, field?.value])

  useEffect(() => {
    if (path && (debouncedValue !== undefined || !fieldExists)) {
      sendField(debouncedValue)
    }
  }, [debouncedValue, sendField, fieldExists, path])

  useEffect(
    () => () => {
      dispatchFields({
        type: 'REMOVE',
        path,
      })
    },
    [dispatchFields, path],
  )

  return {
    ...options,
    showError,
    errorMessage: field?.errorMessage || apiError?.message,
    value: internalValue,
    debouncedValue: field?.value,
    formSubmitted: submitted,
    formProcessing: processing,
    setValue,
  }
}
