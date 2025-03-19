import type { Validate, Value } from '@forms/types'

import { useFormField } from '@forms/useFormField/index'
import { useCallback, useEffect, useRef, useState } from 'react'

// the purpose of this hook is to provide a way to:
// 1. allow the field to update its own value without debounce
// 2. conditionally report the updated value to the form
// 3. allow the field be controlled externally either through props or form context
// 4. standardize repetitive logic across all fields
export const useField = <T extends Value>(props: {
  initialValue?: T
  onChange?: (value: T) => void
  path?: string
  required?: boolean
  validate?: Validate
}): {
  errorMessage?: string
  onChange: (value: T) => void
  showError: boolean
  value: null | T
} => {
  const { initialValue, onChange: onChangeFromProps, path, required, validate } = props
  const hasInitialized = useRef(false)

  const {
    debouncedValue: debouncedValueFromContext,
    errorMessage,
    setValue: setValueInContext,
    showError,
    value: valueFromContext,
  } = useFormField<T>({
    initialValue,
    path,
    required,
    validate,
  })

  const valueFromContextOrProps = valueFromContext !== undefined ? valueFromContext : initialValue

  const [internalState, setInternalState] = useState<null | T>(
    valueFromContext || initialValue || null,
  ) // not debounced

  useEffect(() => {
    if (valueFromContextOrProps !== undefined && valueFromContextOrProps !== internalState) {
      setInternalState(valueFromContextOrProps)
    }
  }, [valueFromContextOrProps, internalState])

  const onChange = useCallback(
    (incomingValue: T) => {
      hasInitialized.current = true
      setInternalState(incomingValue)

      if (typeof setValueInContext === 'function') {
        setValueInContext(incomingValue)
      }

      // if the field is not controlled by the form context, we need to report the change immediately
      // however, if the field is controlled by the form context (`path`), we need to wait for the debounced value
      // this is because the form context will not have updated the value here yet, see note below
      if (!path && typeof onChangeFromProps === 'function') {
        onChangeFromProps(incomingValue)
      }
    },
    [setValueInContext, onChangeFromProps, path],
  )

  // this effect is dependent on the `debouncedValue` because we only want to report the `onChange` event _after_
  // the value has been fully updated in the form context (if applicable, see note above)
  useEffect(() => {
    if (hasInitialized.current && path && typeof onChangeFromProps === 'function') {
      onChangeFromProps(debouncedValueFromContext)
    }
  }, [debouncedValueFromContext, onChangeFromProps, path])

  return {
    errorMessage,
    onChange,
    showError,
    value: internalState,
  }
}
