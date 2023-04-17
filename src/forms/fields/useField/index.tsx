import { useCallback, useEffect, useRef, useState } from 'react'
import { Validate, Value } from '@forms/types'
import { useFormField } from '@forms/useFormField'

// the purpose of this hook is to provide a way to:
// 1. allow the field to update its own value without debounce
// 2. conditionally report the updated value to the form
// 3. allow the field be controlled externally either through props or form context
// 4. standardize repetitive logic across all fields
export const useField = <T extends Value>(props: {
  path?: string
  initialValue?: T
  onChange?: (value: T) => void // eslint-disable-line no-unused-vars
  validate?: Validate
  required?: boolean
}): {
  onChange: (value: T) => void // eslint-disable-line no-unused-vars
  value: T | null
  showError: boolean
  errorMessage?: string
} => {
  const { path, onChange: onChangeFromProps, validate, initialValue, required } = props
  const hasInitialized = useRef(false)

  const {
    value: valueFromContext,
    showError,
    setValue: setValueInContext,
    errorMessage,
  } = useFormField<T>({
    path,
    validate,
    initialValue,
    required,
  })

  const valueFromContextOrProps = valueFromContext !== undefined ? valueFromContext : initialValue

  const [internalState, setInternalState] = useState<T | null>(
    valueFromContext || initialValue || null,
  ) // not debounced

  useEffect(() => {
    if (valueFromContextOrProps !== undefined && valueFromContextOrProps !== internalState)
      setInternalState(valueFromContextOrProps)
  }, [valueFromContextOrProps, internalState])

  const onChange = useCallback(
    (incomingValue: T) => {
      hasInitialized.current = true
      setInternalState(incomingValue)

      if (typeof setValueInContext === 'function') {
        setValueInContext(incomingValue)
      }
    },
    [setValueInContext],
  )

  useEffect(() => {
    if (hasInitialized.current) {
      if (typeof onChangeFromProps === 'function') {
        onChangeFromProps(valueFromContext)
      }
    }
  }, [valueFromContext, onChangeFromProps])

  return {
    onChange,
    value: internalState,
    showError,
    errorMessage,
  }
}
