'use client'

import PhoneInput from 'react-phone-number-input'
import React from 'react'
import Error from '../../Error'
import Label from '../../Label'
import { Validate } from '../../types'
// import 'react-phone-number-input/style.css'
import { useField } from '../useField'

import classes from './index.module.scss'
import { FieldProps } from '../types'

const defaultValidate: Validate = val => {
  const stringVal = val as string
  const isValid = stringVal && stringVal.length > 0

  if (isValid) {
    return true
  }

  return 'Please enter a value.'
}

const Phone: React.FC<FieldProps<string>> = props => {
  const {
    path,
    required = false,
    validate = defaultValidate,
    label,
    placeholder,
    onChange: onChangeFromProps,
    className,
    initialValue,
  } = props

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate,
    required,
  })

  return (
    <div className={[classes.wrap, className].filter(Boolean).join(' ')}>
      <Error showError={showError} message={errorMessage} />
      <Label htmlFor={path} label={label} required={required} />
      <PhoneInput
        className={classes.phone}
        value={value || null}
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
