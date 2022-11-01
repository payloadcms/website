'use client'

import React, { useCallback, useEffect, useState } from 'react'
import ReactSelect from 'react-select'
import { Validate } from '../../types'
import { useField } from '../../useField'
import Label from '../../Label'
import Error from '../../Error'
import classes from './index.module.scss'

type Option = {
  label: string
  value: any
}

type ValidateOptions = {
  required?: boolean
  options: Option[]
}

const defaultValidate = (value: string, options: ValidateOptions): string | true => {
  if (
    typeof value === 'string' &&
    !options.options.find(option => option && option.value === value)
  ) {
    return 'This field has an invalid selection'
  }

  if (options.required && !value) {
    return 'This field is required.'
  }

  return ''
}

export const Select: React.FC<{
  path?: string
  required?: boolean
  label?: string
  options: Option[]
  validate?: Validate
  onChange?: (value: string) => void // eslint-disable-line no-unused-vars
  initialValue?: string
  className?: string
}> = props => {
  const {
    path,
    required,
    validate = defaultValidate,
    label,
    options,
    onChange,
    className,
    initialValue: initialValueFromProps, // allow external control
  } = props

  const fieldFromContext = useField({
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
    incomingOption => {
      const incomingValue = incomingOption ? incomingOption.value : ''
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

  const selectedValue = options?.find(option => option.value === internalState) || null

  return (
    <div
      className={[className, classes.select, showError && classes.error].filter(Boolean).join(' ')}
    >
      <Error showError={showError} message={errorMessage} />
      <Label htmlFor={path} label={label} required={required} />
      <ReactSelect
        onChange={handleChange}
        value={selectedValue}
        options={options}
        className={classes.reactSelect}
        classNamePrefix="rs"
      />
    </div>
  )
}
