'use client'

import { isNumber } from '@root/utilities/isNumber'
import React from 'react'

import type { FieldProps } from '../types'

import Error from '../../Error/index'
import Label from '../../Label/index'
import { useField } from '../useField/index'
import classes from './index.module.scss'

export const NumberInput: React.FC<FieldProps<number>> = (props) => {
  const {
    className,
    initialValue,
    label,
    onChange: onChangeFromProps,
    path,
    placeholder,
    required = false,
    validate,
  } = props

  const defaultValidateFunction = React.useCallback(
    (fieldValue: number | string): string | true => {
      const stringVal = fieldValue as string
      if (required && (!fieldValue || stringVal.length === 0)) {
        return 'Please enter a value.'
      }

      if (fieldValue && !isNumber(fieldValue)) {
        return 'This field can only be a number.'
      }

      return true
    },
    [required],
  )

  const { errorMessage, onChange, showError, value } = useField<number>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    required,
    validate: validate || defaultValidateFunction,
  })

  return (
    <div className={[classes.wrap, className].filter(Boolean).join(' ')}>
      <Error message={errorMessage} showError={showError} />
      <Label htmlFor={path} label={label} required={required} />
      <input
        className={classes.input}
        id={path}
        name={path}
        onChange={(e) => {
          onChange(Number(e.target.value))
        }}
        placeholder={placeholder}
        type="number"
        value={value || ''}
      />
    </div>
  )
}
