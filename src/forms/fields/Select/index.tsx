'use client'

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import ReactSelect from 'react-select'

import type { FieldProps } from '../types'

import Error from '../../Error/index'
import Label from '../../Label/index'
import { useFormField } from '../../useFormField/index'
import classes from './index.module.scss'

type Option = {
  label: string
  value: any
}

type SelectProps = {
  components?: {
    [key: string]: React.FC<any>
  }
  isClearable?: boolean
  isMulti?: boolean
  isSearchable?: boolean
  onMenuScrollToBottom?: () => void
  options: Option[]
  value?: string | string[]
} & FieldProps<string | string[]>

export const Select: React.FC<SelectProps> = (props) => {
  const {
    className,
    components,
    description,
    disabled,
    initialValue: initialValueFromProps, // allow external control
    isClearable,
    isMulti,
    isSearchable = true,
    label,
    onChange,
    onMenuScrollToBottom,
    options,
    path,
    required,
    validate,
    value: valueFromProps, // allow external control
  } = props

  const id = useId()
  const ref = useRef<any>(null)
  const prevValueFromProps = useRef<string | string[] | undefined>(valueFromProps)

  const defaultValidateFunction = React.useCallback(
    (fieldValue: Option | Option[]): string | true => {
      // need to check all types of values here, strings, arrays, and objects
      if (
        required &&
        (!fieldValue ||
          (Array.isArray(fieldValue)
            ? !fieldValue.length
            : !(typeof fieldValue === 'string' ? fieldValue : fieldValue?.value)))
      ) {
        return 'This field is required.'
      }

      const isValid = Array.isArray(fieldValue)
        ? fieldValue.every((v) =>
            options.find((item) => item.value === (typeof v === 'string' ? v : v?.value)),
          )
        : options.find(
            (item) =>
              item.value === (typeof fieldValue === 'string' ? fieldValue : fieldValue?.value),
          )

      if (!isValid) {
        return 'Selected value is not valid option.'
      }

      return true
    },
    [options, required],
  )

  const fieldFromContext = useFormField<string | string[]>({
    initialValue: initialValueFromProps,
    path,
    validate: validate || defaultValidateFunction,
  })

  const { errorMessage, setValue, showError, value: valueFromContext } = fieldFromContext

  const [internalState, setInternalState] = useState<Option | Option[] | undefined>(() => {
    const initialValue = valueFromContext || initialValueFromProps

    if (initialValue && Array.isArray(initialValue)) {
      const matchedOption =
        options?.filter((item) => {
          // `item.value` could be string or array, i.e. `isMulti`
          if (Array.isArray(item.value)) {
            return item.value.find((x) => initialValue.find((y) => y === x))
          }

          return initialValue.find((x) => x === item.value)
        }) || []

      return matchedOption
    }

    return options?.find((item) => item.value === initialValue) || undefined
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
          const internalValues = internalState.map((item) => item.value)
          differences = incomingSelection.filter((x) => internalValues.includes(x))
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
        let newValue: Option | Option[] | undefined = undefined

        if (Array.isArray(incomingSelection)) {
          newValue =
            options?.filter((item) => incomingSelection.find((x) => x === item.value)) || []
        }

        if (typeof incomingSelection === 'string') {
          newValue = options?.find((item) => item.value === incomingSelection) || undefined
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
        selectedOption = incomingSelection.map((item) => item.value)
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

  return (
    <div
      className={[
        className,
        classes.select,
        showError && classes.error,
        isSearchable && classes.isSearchable,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Error message={errorMessage} showError={showError} />
      <Label htmlFor={path} label={label} required={required} />
      <ReactSelect
        className={classes.reactSelect}
        classNamePrefix="rs"
        components={components}
        instanceId={'test'}
        isClearable={isClearable}
        isDisabled={disabled}
        isMulti={isMulti}
        isSearchable={isSearchable}
        noOptionsMessage={() => 'No options'}
        onChange={handleChange}
        onMenuScrollToBottom={onMenuScrollToBottom}
        options={options}
        ref={ref}
        value={internalState}
      />
      {description && <div className={classes.description}>{description}</div>}
    </div>
  )
}
