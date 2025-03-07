'use client'

import type { FieldProps } from '@forms/fields/types'

import Label from '@components/CMSForm/Label/index'
import { CopyToClipboard } from '@components/CopyToClipboard/index'
import Error from '@forms/Error/index'
import { useField } from '@forms/fields/useField/index'
import React, { useEffect, useRef } from 'react'

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
    disabled,
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
    showError: showErrorFromProps,
    validate,
  } = props
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isFocused, setIsFocused] = React.useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => {
    setIsFocused(value ? true : false)
  }

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

  useEffect(() => {
    if (inputRef.current) {
      if (value && value !== '') {
        inputRef.current.style.setProperty(
          '--intrinsic-height',
          String(inputRef.current.scrollHeight ?? 100),
        )
      } else {
        inputRef.current.style.setProperty('--intrinsic-height', String(100))
      }
    }
  }, [inputRef, value])

  return (
    <div
      className={[
        className,
        classes.wrap,
        (showError || showErrorFromProps) && classes.showError,
        isFocused && classes.focused,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={[classes.errorAndLabel].filter(Boolean).join(' ')}>
        <Label
          actionsSlot={copy && <CopyToClipboard value={value} />}
          className={[classes.textareaLabel].filter(Boolean).join(' ')}
          htmlFor={path}
          label={label}
          required={required}
        />
        <Error
          className={classes.errorLabel}
          message={errorMessage}
          showError={Boolean((showError || showErrorFromProps) && errorMessage)}
        />
      </div>
      <textarea
        {...elementAttributes}
        className={[classes.textarea].filter(Boolean).join(' ')}
        disabled={disabled}
        id={path}
        name={path}
        onBlur={handleBlur}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        onFocus={handleFocus}
        placeholder={placeholder}
        ref={inputRef}
        rows={rows}
        value={value || ''}
      />
    </div>
  )
}
