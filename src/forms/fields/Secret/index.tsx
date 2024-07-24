'use client'

import React, { Fragment } from 'react'
import Label from '@forms/Label/index.js'

import { CopyToClipboard } from '@components/CopyToClipboard/index.js'
import { Tooltip } from '@components/Tooltip/index.js'
import { EyeIcon } from '@root/icons/EyeIcon/index.js'
import Error from '../../Error/index.js'
import { FieldProps } from '../types.js'
import { useField } from '../useField/index.js'

import classes from './index.module.scss'

type SecretProps = FieldProps<string> & {
  loadSecret: () => Promise<string>
  largeLabel?: boolean
  readOnly?: boolean
}

export const Secret: React.FC<SecretProps> = props => {
  const {
    path,
    required = false,
    validate,
    label,
    placeholder,
    onChange: onChangeFromProps,
    initialValue,
    className,
    loadSecret: loadValue,
    description,
    largeLabel,
    readOnly,
  } = props

  const [isValueLoaded, setIsValueLoaded] = React.useState(false)
  const [isHidden, setIsHidden] = React.useState(true)

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
    value = '',
    showError,
    errorMessage,
  } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate: validate || defaultValidateFunction,
    required,
  })

  const loadExternalValue = React.useCallback(async (): Promise<string | null> => {
    try {
      const loadedValue = await loadValue()
      onChange(loadedValue)
      setIsValueLoaded(true)
      return loadedValue
    } catch (e) {
      console.error('Error loading external field value', e) // eslint-disable-line no-console
      return null
    }
  }, [loadValue, onChange])

  const toggleVisibility = React.useCallback(async () => {
    if (!isValueLoaded) await loadExternalValue()

    setIsHidden(!isHidden)
  }, [isHidden, isValueLoaded, loadExternalValue])

  return (
    <div
      className={[className, classes.wrap, isHidden ? classes.isHidden : '']
        .filter(Boolean)
        .join(' ')}
    >
      {/*
        This field is display flex in column-reverse, so the html structure is opposite of other fields
        This is so tabs go to the input before the label actions slot
      */}
      {description && <p className={classes.description}>{description}</p>}
      <input
        className={classes.input}
        onChange={e => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        id={path}
        name={path}
        required={required}
        type="text"
        value={isHidden ? '••••••••••••••••••••••••••••••' : value || ''}
        tabIndex={isHidden ? -1 : 0}
        readOnly={readOnly}
      />
      <Error showError={showError} message={errorMessage} />
      <Label
        htmlFor={path}
        label={label}
        required={required}
        className={largeLabel ? classes.largeLabel : ''}
        actionsSlot={
          <Fragment>
            <Tooltip
              text={isHidden ? 'show' : 'hide'}
              onClick={toggleVisibility}
              className={classes.tooltipButton}
            >
              <EyeIcon closed={isHidden} size="large" />
            </Tooltip>
            <CopyToClipboard value={isValueLoaded ? value : loadExternalValue} />
          </Fragment>
        }
      />
    </div>
  )
}
