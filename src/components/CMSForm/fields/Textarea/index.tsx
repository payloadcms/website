'use client'

import React, { useEffect, useRef } from 'react'
import Error from '@forms/Error'
import { FieldProps } from '@forms/fields/types'
import { useField } from '@forms/fields/useField'

import Label from '@components/CMSForm/Label'
import { CopyToClipboard } from '@components/CopyToClipboard'

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
    showError: showErrorFromProps,
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

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
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
          htmlFor={path}
          label={label}
          required={required}
          actionsSlot={copy && <CopyToClipboard value={value} />}
          className={[classes.textareaLabel].filter(Boolean).join(' ')}
        />
        <Error
          className={classes.errorLabel}
          showError={Boolean((showError || showErrorFromProps) && errorMessage)}
          message={errorMessage}
        />
      </div>
      <textarea
        {...elementAttributes}
        ref={inputRef}
        rows={rows}
        className={[classes.textarea].filter(Boolean).join(' ')}
        value={value || ''}
        onChange={e => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        id={path}
        name={path}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  )
}
