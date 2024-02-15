'use client'

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import ReactSelect from 'react-select'
import Error from '@forms/Error'
import { FieldProps } from '@forms/fields/types'
import { useFormField } from '@forms/useFormField'

import Label from '@components/CMSForm/Label'
import { countryOptions } from './countries'
import { stateOptions } from './states'

import classes from './index.module.scss'

type Option = {
  label: string
  value: any
}

type SelectProps = FieldProps<string | string[]> & {
  options: Option[]
  isMulti?: boolean
  isClearable?: boolean
  components?: {
    [key: string]: React.FC<any>
  }
  selectProps?: any
  value?: string | string[]
  onMenuScrollToBottom?: () => void
}

export const Select: React.FC<
  SelectProps & { selectType?: 'normal' | 'state' | 'country' }
> = props => {
  const {
    path,
    required,
    validate,
    label,
    options: optionsFromProps,
    onChange,
    className,
    initialValue: initialValueFromProps, // allow external control
    isMulti,
    isClearable,
    components,
    selectProps,
    value: valueFromProps, // allow external control
    description,
    disabled,
    onMenuScrollToBottom,
    selectType = 'normal',
  } = props

  const [isFocused, setIsFocused] = React.useState(false)

  const id = useId()
  const ref = useRef<any>(null)
  const prevValueFromProps = useRef<string | string[] | undefined>(valueFromProps)

  const options = useMemo(() => {
    switch (selectType) {
      case 'state':
        return stateOptions
      case 'country':
        return countryOptions
      default:
        return optionsFromProps
    }
  }, [selectType, optionsFromProps])

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
        ? fieldValue.every(v =>
            options.find(item => item.value === (typeof v === 'string' ? v : v?.value)),
          ) // eslint-disable-line function-paren-newline
        : options.find(
            item =>
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
    path,
    validate: validate || defaultValidateFunction,
    initialValue: initialValueFromProps,
  })

  const { value: valueFromContext, showError, setValue, errorMessage } = fieldFromContext

  const [internalState, setInternalState] = useState<Option | Option[] | undefined>(() => {
    const initialValue = valueFromContext || initialValueFromProps

    if (initialValue && Array.isArray(initialValue)) {
      const matchedOption =
        options?.filter(item => {
          // `item.value` could be string or array, i.e. `isMulti`
          if (Array.isArray(item.value)) {
            return item.value.find(x => initialValue.find(y => y === x))
          }

          return initialValue.find(x => x === item.value)
        }) || []

      return matchedOption
    }

    return options?.find(item => item.value === initialValue) || undefined
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
        let newValue: Option | Option[] | undefined = undefined

        if (Array.isArray(incomingSelection)) {
          newValue = options?.filter(item => incomingSelection.find(x => x === item.value)) || []
        }

        if (typeof incomingSelection === 'string') {
          newValue = options?.find(item => item.value === incomingSelection) || undefined
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
      setIsFocused(!!valueFromProps)
      prevValueFromProps.current = valueFromProps
    }
  }, [valueFromProps, setFormattedValue, prevValueFromProps])

  const handleChange = useCallback(
    (incomingSelection: Option | Option[]) => {
      let selectedOption

      if (Array.isArray(incomingSelection)) {
        selectedOption = incomingSelection.map(item => item.value)
      } else {
        selectedOption = incomingSelection.value
      }
      setInternalState(incomingSelection)

      // Keep isFocused true if an option is selected
      setIsFocused(!!incomingSelection)

      if (typeof setValue === 'function') {
        setValue(selectedOption)
      }

      if (typeof onChange === 'function') {
        onChange(selectedOption)
      }
    },
    [onChange, setValue],
  )

  const handleMenuClose = () => {
    // Only set isFocused to false if no option is selected
    if (!internalState || (Array.isArray(internalState) && internalState.length === 0)) {
      setIsFocused(false)
    }
  }

  return (
    <div
      className={[
        className,
        classes.select,
        showError && classes.error,
        isFocused && classes.focused,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={[classes.errorAndLabel].filter(Boolean).join(' ')}>
        <Label
          className={[classes.selectLabel].filter(Boolean).join(' ')}
          htmlFor={path}
          label={label}
          required={required}
        />
        <Error className={classes.errorLabel} showError={showError} message={errorMessage} />
      </div>
      <ReactSelect
        ref={ref}
        isMulti={isMulti}
        isClearable={isClearable}
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
        onMenuScrollToBottom={onMenuScrollToBottom}
        noOptionsMessage={() => 'No options'}
        onMenuOpen={() => setIsFocused(true)}
        onMenuClose={handleMenuClose}
      />
      {description && <div className={classes.description}>{description}</div>}
    </div>
  )
}
