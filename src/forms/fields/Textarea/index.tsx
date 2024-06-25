'use client'

import React from 'react'

import { CopyToClipboard } from '@components/CopyToClipboard/index.js'
import Error from '../../Error/index.js'
import Label from '../../Label/index.js'
import { FieldProps } from '../types.js'
import { useField } from '../useField/index.js'

import classes from './index.module.scss'

export const Textarea: React.FC<
  FieldProps<string> & {
    rows?: number
    copy?: boolean
    elementAttributes?: React.InputHTMLAttributes<HTMLTextAreaElement>
  }
> = props => {
  const {
    path,
    required = false,
    validate,
    label,
    placeholder,
    onChange: onChangeFromProps,
    rows = 3,
    initialValue,
    className,
    copy,
    elementAttributes = {
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'none',
    },
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

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  return (
    <div className={[className, classes.wrap].filter(Boolean).join(' ')}>
      <Error showError={showError} message={errorMessage} />
      <Label
        htmlFor={path}
        label={label}
        required={required}
        actionsSlot={copy && <CopyToClipboard value={value} />}
      />
      <textarea
        {...elementAttributes}
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
