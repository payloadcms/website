'use client'

import React, { Fragment, useEffect } from 'react'
import Label from '@forms/Label'

import { CopyToClipboard } from '@components/CopyToClipboard'
import { Tooltip } from '@components/Tooltip'
import { EyeIcon } from '@root/icons/EyeIcon'
import Error from '../../Error'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

export const Text: React.FC<
  FieldProps<string> & {
    type?: 'text' | 'password' | 'hidden'
    copy?: boolean
    elementAttributes?: React.InputHTMLAttributes<HTMLInputElement>
    value?: string
    customOnChange?: (e: any) => void
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
          disabled={disabled}
          className={classes.input}
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
        />
        {icon && <div className={classes.icon}>{icon}</div>}
      </div>
      {type !== 'hidden' && (
        <>
          <Error
            showError={Boolean((showError || showErrorFromProps) && errorMessage)}
            message={errorMessage}
          />
          <Label
            htmlFor={path}
            label={label}
            required={required}
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
        </>
      )}
    </div>
  )
}
