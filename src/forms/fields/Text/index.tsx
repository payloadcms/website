'use client'

import React from 'react'

import { CopyToClipboard } from '@components/CopyToClipboard'
import { TooltipButton } from '@components/TooltipButton'
import Label from '@forms/Label'
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
  } = props

  const [isHidden, setIsHidden] = React.useState(type === 'password')

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate,
    required,
  })

  return (
    <div
      className={[className, classes.wrap, showError && classes.showError]
        .filter(Boolean)
        .join(' ')}
    >
      <Error showError={showError} message={errorMessage} />
      <Label
        htmlFor={path}
        label={label}
        required={required}
        actionsSlot={
          <>
            {copy && <CopyToClipboard value={value} />}
            {type === 'password' && (
              <TooltipButton text={isHidden ? 'show' : 'hide'} onClick={() => setIsHidden(h => !h)}>
                <EyeIcon closed={isHidden} />
              </TooltipButton>
            )}
          </>
        }
      />
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
      {description && <p className={classes.description}>{description}</p>}
    </div>
  )
}
