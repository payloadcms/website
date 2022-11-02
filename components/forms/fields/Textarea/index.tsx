'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useFormField } from '../../useFormField'
import Error from '../../Error'
import Label from '../../Label'
import { Validate } from '../../types'

import classes from './index.module.scss'

const defaultValidate: Validate = val => {
  const stringVal = val as string
  const isValid = stringVal && stringVal.length > 0

  if (isValid) {
    return true
  }

  return 'Please enter a value.'
}

export const Textarea: React.FC<{
  path?: string
  required?: boolean
  validate?: Validate
  label?: string
  placeholder?: string
  onChange?: (value: string) => void // eslint-disable-line no-unused-vars
  marginBottom?: boolean
  rows?: number
  initialValue?: string
  className?: string
}> = props => {
  const {
    path,
    required = false,
    validate = defaultValidate,
    label,
    placeholder,
    onChange,
    rows = 3,
    initialValue: initialValueFromProps, // allow external control
    className,
  } = props

  const fieldFromContext = useFormField<string>({
    path,
    validate: required ? validate : undefined,
  })

  const { value: valueFromContext, showError, setValue, errorMessage } = fieldFromContext

  const valueFromContextOrProps = valueFromContext || initialValueFromProps
  const [internalState, setInternalState] = useState<string>(
    valueFromContext || initialValueFromProps,
  ) // not debounced

  useEffect(() => {
    if (valueFromContextOrProps !== undefined && valueFromContextOrProps !== internalState)
      setInternalState(valueFromContextOrProps)
  }, [valueFromContextOrProps, internalState])

  const handleChange = useCallback(
    e => {
      const { value: incomingValue } = e.target
      setInternalState(incomingValue)
      if (typeof setValue === 'function') {
        setValue(incomingValue)
      }
      if (typeof onChange === 'function') {
        onChange(incomingValue)
      }
    },
    [onChange, setValue],
  )

  return (
    <div className={[className, classes.wrap].filter(Boolean).join(' ')}>
      <Error showError={showError} message={errorMessage} />
      <Label htmlFor={path} label={label} required={required} />
      <textarea
        rows={rows}
        className={classes.textarea}
        value={(internalState as string) || ''}
        onChange={handleChange}
        placeholder={placeholder}
        id={path}
        name={path}
      />
    </div>
  )
}
