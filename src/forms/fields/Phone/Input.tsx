'use client'

import React from 'react'
import PhoneInput from 'react-phone-number-input'

import Error from '../../Error'
import Label from '../../Label'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

const Phone: React.FC<FieldProps<string>> = props => {
  const {
    path,
    required = false,
    validate,
    label,
    placeholder,
    onChange: onChangeFromProps,
    className,
    initialValue,
  } = props

  const defaultValidateFunction = React.useCallback(
    (fieldValue: string): string | true => {
      const stringVal = fieldValue as string
      if (required && (!fieldValue || stringVal.length === 0)) {
        return 'Please enter a value.'
      }

      return true
    },
    [required],
  )

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  return (
    <div className={[classes.wrap, className].filter(Boolean).join(' ')}>
      <Error showError={showError} message={errorMessage} />
      <Label htmlFor={path} label={label} required={required} />
      <PhoneInput
        className={classes.phone}
        value={value || undefined}
        onChange={onChange}
        placeholder={placeholder}
        defaultCountry="US"
        id={path}
        name={path}
        countrySelectProps={{
          className: classes.countrySelect,
        }}
      />
    </div>
  )
}

export default Phone
