'use client'

import { CopyToClipboard } from '@components/CopyToClipboard/index'
import { Tooltip } from '@components/Tooltip/index'
import Label from '@forms/Label/index'
import { EyeIcon } from '@root/icons/EyeIcon/index'
import React, { Fragment, useEffect } from 'react'

import type { FieldProps } from '../types'

import Error from '../../Error/index'
import { useField } from '../useField/index'
import classes from './index.module.scss'

export const Text: React.FC<
  {
    copy?: boolean
    customOnChange?: (e: any) => void
    elementAttributes?: React.InputHTMLAttributes<HTMLInputElement>
    readOnly?: boolean
    suffix?: React.ReactNode
    type?: 'hidden' | 'password' | 'text'
    value?: string
  } & FieldProps<string>
> = (props) => {
  const {
    name,
    type = 'text',
    className,
    copy = false,
    customOnChange,
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
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/*
        This field is display flex in column-reverse, so the html structure is opposite of other fields
        This is so tabs go to the input before the label actions slot
      */}
      {description && <p className={classes.description}>{description}</p>}
      <div className={classes.inputWrap}>
        <input
          {...elementAttributes}
          className={classes.input}
          disabled={disabled}
          id={path}
          name={name ?? path}
          onChange={(e) => {
            const onChangeFunction = customOnChange ? customOnChange : onChange

            if (!disabled && !readOnly) {
              onChangeFunction(e.target.value)
            }
          }}
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
      {type !== 'hidden' && (
        <>
          <Error
            message={errorMessage}
            showError={Boolean((showError || showErrorFromProps) && errorMessage)}
          />
          <Label
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
            htmlFor={path}
            label={label}
            margin={false}
            required={required}
          />
        </>
      )}
    </div>
  )
}
