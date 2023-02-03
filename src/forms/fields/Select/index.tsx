'use client'

import React, { useCallback, useEffect, useId, useRef, useState } from 'react'
import ReactSelect from 'react-select'
import { useTheme } from '@providers/Theme'

import Error from '../../Error'
import Label from '../../Label'
import { Validate } from '../../types'
import { useFormField } from '../../useFormField'

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
  onChange?: (value: Option | Option[]) => void // eslint-disable-line no-unused-vars
  initialValue?: string | string[]
  className?: string
  isMulti?: boolean
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
    isMulti,
  } = props

  const id = useId()
  const ref = useRef<any>(null)

  const fieldFromContext = useFormField<string | string[]>({
    path,
    validate: required ? validate : undefined,
  })

  const { value: valueFromContext, showError, setValue, errorMessage } = fieldFromContext

  const valueFromContextOrProps = valueFromContext || initialValueFromProps

  const [internalState, setInternalState] = useState<Option | Option[]>(() => {
    const initialValue = valueFromContext || initialValueFromProps
    if (Array.isArray(initialValue)) {
      return options?.filter(item => item.value === initialValue) || []
    }

    return options?.find(item => item.value === initialValue) || null
  })

  useEffect(() => {
    let isDifferent = false
    let differences

    if (Array.isArray(valueFromContextOrProps) && Array.isArray(internalState)) {
      const internalValues = internalState.map(item => item.value)
      differences = valueFromContextOrProps.filter(x => internalValues.includes(x))
      isDifferent = differences.length > 0
    }

    if (typeof valueFromContextOrProps === 'string' && typeof internalState === 'string') {
      isDifferent = valueFromContextOrProps !== internalState
    }

    if (valueFromContextOrProps !== undefined && isDifferent) {
      let newValue = null

      if (Array.isArray(valueFromContextOrProps)) {
        newValue =
          options?.filter(item => valueFromContextOrProps.find(x => x === item.value)) || []
      }

      if (typeof valueFromContextOrProps === 'string') {
        newValue = options?.find(item => item.value === valueFromContextOrProps) || null
      }

      setInternalState(newValue)
    }
  }, [valueFromContextOrProps, internalState])

  const handleChange = useCallback(
    (incomingSelection: Option | Option[]) => {
      setInternalState(incomingSelection)

      if (typeof setValue === 'function') {
        setValue(incomingSelection)
      }

      if (typeof onChange === 'function') {
        onChange(incomingSelection)
      }
    },
    [onChange, setValue],
  )

  const theme = useTheme()

  return (
    <div
      className={[
        className,
        classes.select,
        showError && classes.error,
        theme && classes[`theme-${theme}`],
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Error showError={showError} message={errorMessage} />
      <Label htmlFor={path} label={label} required={required} />
      <ReactSelect
        ref={ref}
        isMulti={isMulti}
        instanceId={id}
        onChange={handleChange}
        options={options}
        value={internalState}
        className={classes.reactSelect}
        classNamePrefix="rs"
      />
    </div>
  )
}
