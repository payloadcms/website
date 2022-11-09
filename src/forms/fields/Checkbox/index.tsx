'use client'

import React from 'react'
import { Check } from '@icons/Check'
import Error from '../../Error'
import { useField } from '../useField'
import { FieldProps } from '../types'
import classes from './index.module.scss'

const defaultValidate = (value: boolean, options = {} as any) => {
  if ((value && typeof value !== 'boolean') || (options.required && typeof value !== 'boolean')) {
    return 'This field can only be equal to true or false.'
  }

  return true
}

export const Checkbox: React.FC<FieldProps<boolean>> = props => {
  const {
    path,
    required,
    label,
    onChange: onChangeFromProps,
    initialValue,
    validate = defaultValidate,
    className,
  } = props

  const { onChange, value, showError, errorMessage } = useField<boolean>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate,
    required,
  })

  return (
    <div
      className={[className, classes.checkbox, showError && classes.error, value && classes.checked]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.errorWrap}>
        <Error showError={showError} message={errorMessage} />
      </div>
      <input
        className={classes.htmlInput}
        type="checkbox"
        name={path}
        id={path}
        checked={Boolean(value)}
        readOnly
      />
      <button
        type="button"
        className={classes.button}
        onClick={() => {
          onChange(!value)
        }}
      >
        <span className={classes.input}>
          <Check className={classes.icon} size="large" bold />
        </span>
        <span className={classes.label}>{label}</span>
      </button>
    </div>
  )
}
