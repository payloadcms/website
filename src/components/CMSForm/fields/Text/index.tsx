'use client'

import React, { Fragment, useEffect } from 'react'
import Error from '@forms/Error'
import { FieldProps } from '@forms/fields/types'
import { useField } from '@forms/fields/useField'

import Label from '@components/CMSForm/Label'
import { CopyToClipboard } from '@components/CopyToClipboard'
import { Tooltip } from '@components/Tooltip'
import { EyeIcon } from '@root/icons/EyeIcon'

import classes from './index.module.scss'

export const Text: React.FC<
  FieldProps<string> & {
    type?: 'text' | 'password' | 'hidden'
    copy?: boolean
    elementAttributes?: React.InputHTMLAttributes<HTMLInputElement>
    value?: string
    customOnChange?: (e: any) => void
    suffix?: React.ReactNode
    readOnly?: boolean
  }
> = props => {
  const {
    path,
    required = false,
    validate,
    label,
    placeholder,
    type = 'text',
    onChange: onChangeFromProps,
    customOnChange,
    initialValue,
    className,
    copy = false,
    disabled,
    readOnly,
    elementAttributes = {
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'none',
    },
    description,
    value: valueFromProps,
    showError: showErrorFromProps,
    icon,
    fullWidth = true,
    suffix,
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
    onChange,
    value: valueFromContext,
    showError,
    errorMessage,
  } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
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
            className={[classes.textLabel].filter(Boolean).join(' ')}
            htmlFor={path}
            label={label}
            required={required}
            margin={false}
            actionsSlot={
              <Fragment>
                {copy && <CopyToClipboard value={value} />}
                {type === 'password' && (
                  <Tooltip
                    text={isHidden ? 'show' : 'hide'}
                    onClick={() => setIsHidden(h => !h)}
                    className={classes.tooltipButton}
                  >
                    <EyeIcon closed={isHidden} size="large" />
                  </Tooltip>
                )}
              </Fragment>
            }
          />
          <Error
            className={classes.error}
            showError={Boolean((showError || showErrorFromProps) && errorMessage)}
            message={errorMessage}
          />
        </div>
      )}
      <input
        {...elementAttributes}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={[classes.input].filter(Boolean).join(' ')}
        value={value || ''}
        onChange={
          customOnChange
            ? customOnChange
            : e => {
                onChange(e.target.value)
              }
        }
        placeholder={placeholder}
        type={type === 'password' && !isHidden ? 'text' : type}
        id={path}
        name={path}
        readOnly={readOnly}
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
