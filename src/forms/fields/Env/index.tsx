'use client'

import React from 'react'

import Error from '../../Error'
import Label from '../../Label'
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

export const EnvInput: React.FC<
  FieldProps<string> & {
    url: string
  }
> = props => {
  const {
    path,
    required = false,
    validate = defaultValidate,
    label,
    placeholder,
    url,
    onChange: onChangeFromProps,
    initialValue,
    className,
  } = props

  const [hasRevealed, setHasRevealed] = React.useState(false)

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate,
    required,
  })

  const getEnvValue = async () => {
    const response = await fetch(url)
    const json = await response.json()
    return json
  }

  console.log(initialValue, value)

  return (
    <div className={[className, classes.wrap].filter(Boolean).join(' ')}>
      <Error showError={showError} message={errorMessage} />
      <div>
        <Label htmlFor={path} label={label} required={required} />
        <div>copy | eye</div>
      </div>

      <div className={classes.inputContainer}>
        <input
          className={classes.input}
          value={value || ''}
          onChange={e => {
            onChange(e.target.value)
          }}
          placeholder={placeholder}
          type="text"
          id={path}
          name={path}
        />
        {!hasRevealed && (
          <button className={classes.revealButton} type="button">
            <label>reveal</label>
          </button>
        )}
      </div>
    </div>
  )
}
