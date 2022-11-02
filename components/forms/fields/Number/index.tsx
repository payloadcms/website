'use client'

import React from 'react'
import Error from '../../Error'
import Label from '../../Label'
import { Validate } from '../../types'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

const defaultValidate: Validate = val => {
  const stringVal = val as string
  const isValid = stringVal && stringVal.length > 0

  if (isValid) {
    return true
  }

  return 'Please enter a value.'
}

export const NumberInput: React.FC<FieldProps<number>> = props => {
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

  const { onChange, value, showError, errorMessage } = useField<number>({
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
      <input
        className={classes.input}
        value={value || ''}
        onChange={e => {
          onChange(Number(e.target.value))
        }}
        placeholder={placeholder}
        type="number"
        id={path}
        name={path}
      />
    </div>
  )
}
