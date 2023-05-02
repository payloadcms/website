'use client'

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import ReactSelect from 'react-select'
import { useTheme } from '@providers/Theme'

import Error from '../../Error'
import Label from '../../Label'
import { useFormField } from '../../useFormField'
import { FieldProps } from '../types'

import classes from './index.module.scss'

type Option = {
  label: string
  value: any
}

type SelectProps = FieldProps<string> & {
  options: Option[]
  isMulti?: boolean
  components?: {
    [key: string]: React.FC<any>
  }
  selectProps?: any
  value?: string | string[]
}

export const Select: React.FC<SelectProps> = props => {
  const {
    path,
    required,
    validate,
    label,
    options,
    onChange,
    className,
    initialValue: initialValueFromProps, // allow external control
    isMulti,
    components,
    selectProps,
    value: valueFromProps, // allow external control
    description,
    disabled,
  } = props

  const id = useId()
  const ref = useRef<any>(null)
  const prevValueFromProps = useRef<string | string[] | undefined>(valueFromProps)

  const defaultValidateFunction = React.useCallback(
    (fieldValue: string): string | true => {
      if (required && !fieldValue) {
        return 'This field is required.'
      }

      if (fieldValue && !options.find(option => option && option.value === fieldValue)) {
        return 'This field has an invalid selection'
      }

      return true
    },
    [options, required],
  )

  const fieldFromContext = useFormField<string | string[]>({
    path,
    validate: validate || defaultValidateFunction,
    initialValue: initialValueFromProps,
  })

  const { value: valueFromContext, showError, setValue, errorMessage } = fieldFromContext

  const [internalState, setInternalState] = useState<Option | Option[] | null>(() => {
    const initialValue = valueFromContext || initialValueFromProps
    if (Array.isArray(initialValue)) {
      return options?.filter(item => initialValue?.some(item.value)) || []
    }

    return options?.find(item => item.value === initialValue) || null
  })

  const setFormattedValue = useCallback(
    (incomingSelection?: string | string[]) => {
      let isDifferent = false
      let differences

      if (incomingSelection && !internalState) {
        isDifferent = true
      }

      if (incomingSelection && internalState) {
        if (Array.isArray(incomingSelection) && Array.isArray(internalState)) {
          const internalValues = internalState.map(item => item.value)
          differences = incomingSelection.filter(x => internalValues.includes(x))
          isDifferent = differences.length > 0
        }

        if (typeof incomingSelection === 'string' && typeof internalState === 'string') {
          isDifferent = incomingSelection !== internalState
        }

        if (
          typeof incomingSelection === 'string' &&
          typeof internalState === 'object' &&
          internalState !== null &&
          'value' in internalState
        ) {
          isDifferent = incomingSelection !== internalState.value
        }
      }

      if (incomingSelection !== undefined && isDifferent) {
        let newValue: Option | Option[] | null = null

        if (Array.isArray(incomingSelection)) {
          newValue = options?.filter(item => incomingSelection.find(x => x === item.value)) || []
        }

        if (typeof incomingSelection === 'string') {
          newValue = options?.find(item => item.value === incomingSelection) || null
        }

        setInternalState(newValue)
      }
    },
    [internalState, options],
  )

  // allow external control
  useEffect(() => {
    // compare prevValueFromProps.current to valueFromProps
    // this is bc components which are externally control the value AND rendered inside the form context
    // will throw an infinite loop after the form state is updated-even if the value is the same, it is a new instance
    if (valueFromProps !== prevValueFromProps.current) {
      setFormattedValue(valueFromProps)
      prevValueFromProps.current = valueFromProps
    }
  }, [valueFromProps, setFormattedValue, prevValueFromProps])

  const handleChange = useCallback(
    (incomingSelection: Option | Option[]) => {
      let selectedOption
      if (Array.isArray(incomingSelection)) {
        selectedOption = incomingSelection
      } else {
        selectedOption = incomingSelection.value
      }
      setInternalState(incomingSelection)

      if (typeof setValue === 'function') {
        setValue(selectedOption)
      }

      if (typeof onChange === 'function') {
        onChange(selectedOption)
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
        components={components}
        // @ts-expect-error
        selectProps={selectProps}
        isDisabled={disabled}
      />
      {description && <div className={classes.description}>{description}</div>}
    </div>
  )
}
