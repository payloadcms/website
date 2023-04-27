'use client'

import React, { useEffect } from 'react'

import { CheckIcon } from '@root/icons/CheckIcon'
import Error from '../../Error'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

// "You must agree to the terms of service to deploy your project."

const defaultValidate = (value: boolean, options = {} as any) => {
  if ((value && typeof value !== 'boolean') || (options.required && typeof value !== 'boolean')) {
    return 'This field can only be equal to true or false.'
  }

  if (options.required && !value) {
    return 'This field is required.'
  }

  return true
}

export const Checkbox: React.FC<
  FieldProps<boolean> & {
    checked?: boolean
  }
> = props => {
  const {
    path,
    required,
    label,
    onChange: onChangeFromProps,
    initialValue,
    validate = defaultValidate,
    className,
    checked: checkedFromProps,
    disabled,
  } = props

  const [checked, setChecked] = React.useState<boolean | undefined | null>(initialValue || false)
  const prevChecked = React.useRef<boolean | undefined | null>(checked)
  const prevContextValue = React.useRef<boolean | undefined | null>(initialValue)

  const {
    onChange,
    value: valueFromContext,
    showError,
    errorMessage,
  } = useField<boolean>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate,
    required,
  })

  // allow external control
  useEffect(() => {
    if (
      checkedFromProps !== undefined &&
      checkedFromProps !== prevChecked.current &&
      checkedFromProps !== checked
    ) {
      setChecked(checkedFromProps)
    }

    prevChecked.current = checkedFromProps
  }, [checkedFromProps, checked])

  // allow context control
  useEffect(() => {
    if (
      valueFromContext !== undefined &&
      valueFromContext !== prevContextValue.current &&
      valueFromContext !== checked
    ) {
      setChecked(valueFromContext)
    }

    prevContextValue.current = valueFromContext
  }, [valueFromContext, checked])

  return (
    <div
      className={[
        className,
        classes.checkbox,
        showError && classes.error,
        checked && classes.checked,
        disabled && classes.disabled,
      ]
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
        checked={Boolean(checked)}
        readOnly
        disabled={disabled}
        tabIndex={-1}
      />
      <button
        type="button"
        className={classes.button}
        onClick={() => {
          if (!disabled) onChange(!checked)
        }}
        disabled={disabled}
      >
        <span className={classes.input}>
          <CheckIcon className={classes.icon} size="medium" bold />
        </span>
        <span className={classes.label}>{label}</span>
      </button>
    </div>
  )
}
