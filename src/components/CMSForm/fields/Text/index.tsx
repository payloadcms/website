'use client'

import type { FieldProps } from '@forms/fields/types'

import Label from '@components/CMSForm/Label/index'
import { CopyToClipboard } from '@components/CopyToClipboard/index'
import { Tooltip } from '@components/Tooltip/index'
import Error from '@forms/Error/index'
import { useField } from '@forms/fields/useField/index'
import { EyeIcon } from '@root/icons/EyeIcon/index'
import React, { Fragment, useEffect } from 'react'

import classes from './index.module.scss'

export const Text: React.FC<
  {
    copy?: boolean
    customOnChange?: (e: any) => void
    defaultValue?: string
    elementAttributes?: React.InputHTMLAttributes<HTMLInputElement>
    readOnly?: boolean
    suffix?: React.ReactNode
    type?: 'hidden' | 'password' | 'text'
    value?: string
  } & FieldProps<string>
> = (props) => {
  const {
    type = 'text',
    className,
    copy = false,
    customOnChange,
    defaultValue,
    description,
    disabled,
    elementAttributes = {
      autoCapitalize: 'none',
      autoComplete: 'off',
      autoCorrect: 'off',
    },
    fullWidth = true,
    icon,
    initialValue,
    label,
    onChange: onChangeFromProps,
    path,
    placeholder,
    readOnly,
    required = false,
    showError: showErrorFromProps,
    suffix,
    validate,
    value: valueFromProps,
  } = props

  const prevValueFromProps = React.useRef(valueFromProps)

  const [isHidden, setIsHidden] = React.useState(type === 'password')
  const [isFocused, setIsFocused] = React.useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => {
    setIsFocused(value ? true : false)
  }

  const defaultValidateFunction = React.useCallback(
    (fieldValue: boolean): string | true => {
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

  const {
    errorMessage,
    onChange,
    showError,
    value: valueFromContext,
  } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    required,
    validate: validate || defaultValidateFunction,
  })

  const value = valueFromProps || valueFromContext

  useEffect(() => {
    if (
      valueFromProps !== undefined &&
      valueFromProps !== prevValueFromProps.current &&
      valueFromProps !== valueFromContext
    ) {
      prevValueFromProps.current = valueFromProps
      onChange(valueFromProps)
    }
  }, [valueFromProps, onChange, valueFromContext])

  return (
    <div
      className={[
        className,
        classes.component,
        (showError || showErrorFromProps) && classes.showError,
        classes[`type--${type}`],
        fullWidth && classes.fullWidth,
        isFocused && classes.focused,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {description && <p className={classes.description}>{description}</p>}
      {type !== 'hidden' && (
        <div className={[classes.errorAndLabel].filter(Boolean).join(' ')}>
          <Label
            actionsClassName={[!copy && type !== 'password' && classes.actionsLabel]
              .filter(Boolean)
              .join(' ')}
            actionsSlot={
              <Fragment>
                {copy && <CopyToClipboard value={value} />}
                {type === 'password' && (
                  <Tooltip
                    className={classes.tooltipButton}
                    onClick={() => setIsHidden((h) => !h)}
                    text={isHidden ? 'show' : 'hide'}
                  >
                    <EyeIcon closed={isHidden} size="large" />
                  </Tooltip>
                )}
              </Fragment>
            }
            className={[classes.textLabel].filter(Boolean).join(' ')}
            htmlFor={path}
            label={label}
            margin={false}
            required={required}
          />
          <Error
            className={classes.error}
            message={errorMessage}
            showError={Boolean((showError || showErrorFromProps) && errorMessage)}
          />
        </div>
      )}
      <input
        {...elementAttributes}
        className={[classes.input].filter(Boolean).join(' ')}
        defaultValue={defaultValue}
        disabled={disabled}
        id={path}
        name={path}
        onBlur={handleBlur}
        onChange={
          customOnChange
            ? customOnChange
            : (e) => {
                onChange(e.target.value)
              }
        }
        onFocus={handleFocus}
        placeholder={placeholder}
        readOnly={readOnly}
        type={type === 'password' && !isHidden ? 'text' : type}
        value={value || ''}
      />
      {(icon || suffix) && (
        <div className={classes.iconWrapper}>
          {suffix && <div className={classes.suffix}>{suffix}</div>}
          {icon && <div className={classes.icon}>{icon}</div>}
        </div>
      )}
    </div>
  )
}
