'use client'

import React from 'react'
import Error from '../../Error'
import Label from '../../Label'
import { Validate } from '../../types'

import classes from './index.module.scss'
import { useField } from '../useField'
import { FieldProps } from '../types'

const defaultValidate: Validate = val => {
  const stringVal = val as string
  const isValid = stringVal && stringVal.length > 0

  if (isValid) {
    return true
  }

  return 'Please enter a value.'
}

export const Textarea: React.FC<
  FieldProps<string> & {
    rows?: number
  }
> = props => {
  const {
    path,
    required = false,
    validate = defaultValidate,
    label,
    placeholder,
    onChange: onChangeFromProps,
    rows = 3,
    initialValue,
    className,
  } = props

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate,
    required,
  })

  return (
    <div className={[className, classes.wrap].filter(Boolean).join(' ')}>
      <Error showError={showError} message={errorMessage} />
      <Label htmlFor={path} label={label} required={required} />
      <textarea
        rows={rows}
        className={classes.textarea}
        value={value || ''}
        onChange={e => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        id={path}
        name={path}
      />
    </div>
  )
}
