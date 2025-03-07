'use client'

import { CopyToClipboard } from '@components/CopyToClipboard/index'
import React from 'react'

import type { FieldProps } from '../types'

import Error from '../../Error/index'
import Label from '../../Label/index'
import { useField } from '../useField/index'
import classes from './index.module.scss'

export const Textarea: React.FC<
  {
    copy?: boolean
    elementAttributes?: React.InputHTMLAttributes<HTMLTextAreaElement>
    rows?: number
  } & FieldProps<string>
> = (props) => {
  const {
    className,
    copy,
    elementAttributes = {
      autoCapitalize: 'none',
      autoComplete: 'off',
      autoCorrect: 'off',
    },
    initialValue,
    label,
    onChange: onChangeFromProps,
    path,
    placeholder,
    required = false,
    rows = 3,
    validate,
  } = props

  const defaultValidateFunction = React.useCallback(
    (fieldValue: string): string | true => {
      if (required && !fieldValue) {
        return 'Please enter a value.'
      }

      if (fieldValue && typeof fieldValue !== 'string') {
        return 'This field can only be a string.'
      }

      return true
    },
    [required],
  )

  const { errorMessage, onChange, showError, value } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    required,
    validate: validate || defaultValidateFunction,
  })

  return (
    <div className={[className, classes.wrap].filter(Boolean).join(' ')}>
      <Error message={errorMessage} showError={showError} />
      <Label
        actionsSlot={copy && <CopyToClipboard value={value} />}
        htmlFor={path}
        label={label}
        required={required}
      />
      <textarea
        {...elementAttributes}
        className={classes.textarea}
        id={path}
        name={path}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        rows={rows}
        value={value || ''}
      />
    </div>
  )
}
