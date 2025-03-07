'use client'

import type { FieldProps } from '@forms/fields/types'

import Label from '@components/CMSForm/Label/index'
import Error from '@forms/Error/index'
import { useField } from '@forms/fields/useField/index'
import { CheckIcon } from '@root/icons/CheckIcon/index'
import React, { useEffect } from 'react'

import classes from './index.module.scss'

export const Checkbox: React.FC<
  {
    checked?: boolean
  } & FieldProps<boolean>
> = (props) => {
  const {
    checked: checkedFromProps,
    className,
    disabled,
    initialValue,
    label,
    onChange: onChangeFromProps,
    path,
    required,
    validate,
  } = props

  const [checked, setChecked] = React.useState<boolean | null | undefined>(initialValue || false)
  const prevChecked = React.useRef<boolean | null | undefined>(checked)
  const prevContextValue = React.useRef<boolean | null | undefined>(initialValue)

  const defaultValidateFunction = React.useCallback(
    (fieldValue: boolean): string | true => {
      if (required && !fieldValue) {
        return 'This field is required.'
      }

      if (typeof fieldValue !== 'boolean') {
        return 'This field can only be equal to true or false.'
      }

      return true
    },
    [required],
  )

  const {
    errorMessage,
    onChange,
    showError,
    value: valueFromContext,
  } = useField<boolean>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    required,
    validate: validate || defaultValidateFunction,
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
      <input
        checked={Boolean(checked)}
        className={classes.htmlInput}
        disabled={disabled}
        id={path}
        name={path}
        readOnly
        tabIndex={-1}
        type="checkbox"
      />
      <button
        className={classes.button}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            onChange(!checked)
          }
        }}
        type="button"
      >
        <span className={classes.input}>
          <CheckIcon bold className={classes.icon} size="medium" />
        </span>
        <Label className={classes.label} htmlFor={path} label={label} required={required} />
      </button>
      <Error className={classes.errorLabel} message={errorMessage} showError={showError} />
    </div>
  )
}
