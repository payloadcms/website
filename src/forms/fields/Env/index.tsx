'use client'

import React from 'react'

import { TooltipButton } from '@components/TooltipButton'
import { EyeIcon } from '@root/icons/EyeIcon'
import Error from '../../Error'
import Label from '../../Label'
import { Validate } from '../../types'
import { FieldProps } from '../types'
import { useField } from '../useField'
import { CopyValue } from './CopyValue'

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
    fetchEnv: () => Promise<string>
  }
> = props => {
  const {
    path,
    required = false,
    validate = defaultValidate,
    label,
    placeholder,
    fetchEnv: getENV,
    onChange: onChangeFromProps,
    initialValue,
    className,
  } = props

  const [hasFetched, setHasFetched] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)

  const { onChange, value, showError, errorMessage } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate,
    required,
  })

  const firstFetch = React.useCallback(async (): Promise<string> => {
    try {
      const env = await getENV()
      onChange(env)
      setHasFetched(true)
      return env
    } catch (e) {
      console.error('Error fetching env variable', e)
      return null
    }
  }, [getENV, onChange])

  const getValueToCopy = React.useCallback(async (): Promise<string> => {
    if (!hasFetched) return firstFetch()

    return value
  }, [value, hasFetched, firstFetch])

  const toggleVisibility = React.useCallback(async () => {
    if (!hasFetched) await firstFetch()

    setIsVisible(!isVisible)
  }, [isVisible, hasFetched, firstFetch])

  return (
    <div
      className={[className, classes.wrap, isVisible ? classes.isVisible : '']
        .filter(Boolean)
        .join(' ')}
    >
      <Error showError={showError} message={errorMessage} />
      <div className={classes.labelBar}>
        <Label htmlFor={path} label={label} required={required} />
        {getENV && (
          <div className={classes.labelBarActions}>
            <TooltipButton text={isVisible ? 'hide' : 'show'} onClick={toggleVisibility}>
              <EyeIcon />
            </TooltipButton>

            <CopyValue getValueToCopy={getValueToCopy} />
          </div>
        )}
      </div>

      <input
        className={classes.input}
        value={isVisible ? value : '••••••••••'}
        onChange={e => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        type="text"
        id={path}
        name={path}
        required={required}
        tabIndex={isVisible ? 0 : -1}
      />
    </div>
  )
}
