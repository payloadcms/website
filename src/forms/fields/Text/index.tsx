'use client'

import React, { Fragment, useEffect } from 'react'
import Label from '@forms/Label'

import { CopyToClipboard } from '@components/CopyToClipboard'
import { TooltipButton } from '@components/TooltipButton'
import { Spinner } from '@root/app/_components/Spinner'
import { EyeIcon } from '@root/icons/EyeIcon'
import Error from '../../Error'
import { Validate } from '../../types'
import { FieldProps } from '../types'
import { useField } from '../useField'

import classes from './index.module.scss'

const defaultValidate: Validate = val => {
  const stringVal = val as string
  const isValid = stringVal && stringVal.length > 0

  if (isValid) {
    return true
  }

  return 'Please enter a value.'
}

export const Text: React.FC<
  FieldProps<string> & {
    type?: 'text' | 'password' | 'hidden'
    copy?: boolean
    elementAttributes?: React.InputHTMLAttributes<HTMLInputElement>
    value?: string
  }
> = props => {
  const {
    path,
    required = false,
    validate = defaultValidate,
    label,
    placeholder,
    type = 'text',
    onChange: onChangeFromProps,
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
  } = props

  const prevValueFromProps = React.useRef(valueFromProps)

  const [isHidden, setIsHidden] = React.useState(type === 'password')

  const {
    onChange,
    value: valueFromContext,
    showError,
    errorMessage,
  } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate,
    required,
  })

  const value = valueFromProps || valueFromContext

  useEffect(() => {
    if (valueFromProps !== undefined && valueFromProps !== valueFromContext) {
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
          onChange={e => {
            onChange(e.target.value)
          }}
          placeholder={placeholder}
          type={type === 'password' && !isHidden ? 'text' : type}
          id={path}
          name={path}
        />
        {icon && <div className={classes.icon}>{icon}</div>}
      </div>
      {type !== 'hidden' && (
        <>
          <Error showError={showError || Boolean(showErrorFromProps)} message={errorMessage} />
          <Label
            htmlFor={path}
            label={label}
            required={required}
            actionsSlot={
              <Fragment>
                {copy && <CopyToClipboard value={value} />}
                {type === 'password' && (
                  <TooltipButton
                    text={isHidden ? 'show' : 'hide'}
                    onClick={() => setIsHidden(h => !h)}
                    className={classes.tooltipButton}
                  >
                    <EyeIcon closed={isHidden} size="large" />
                  </TooltipButton>
                )}
              </Fragment>
            }
          />
        </>
      )}
    </div>
  )
}
