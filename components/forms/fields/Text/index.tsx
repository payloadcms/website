'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useField } from '../../useField'
import { Field } from '../../useField/types'
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

export const Text: React.FC<{
  path?: string
  required?: boolean
  validate?: Validate
  label?: string
  placeholder?: string
  type?: 'text' | 'hidden'
  onChange?: (value: string) => void // eslint-disable-line no-unused-vars
  initialValue?: string
  className?: string
}> = props => {
  const {
    path,
    required = false,
    validate = defaultValidate,
    label,
    placeholder,
    type = 'text',
    onChange,
    initialValue: initialValueFromProps, // allow external control
    className,
  } = props

  const fieldFromContext = useField({
    path,
    validate: required ? validate : undefined,
  })

  const {
    value: valueFromContext,
    showError,
    setValue,
    errorMessage,
  }: Field<string> = fieldFromContext

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
      <input
        className={classes.input}
        value={(internalState as string) || ''}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        id={path}
        name={path}
      />
    </div>
  )
}
