'use client'

import { CopyToClipboard } from '@components/CopyToClipboard/index'
import { Tooltip } from '@components/Tooltip/index'
import Label from '@forms/Label/index'
import { EyeIcon } from '@root/icons/EyeIcon/index'
import React, { Fragment } from 'react'

import type { FieldProps } from '../types'

import Error from '../../Error/index'
import { useField } from '../useField/index'
import classes from './index.module.scss'

type SecretProps = {
  largeLabel?: boolean
  loadSecret: () => Promise<string>
  readOnly?: boolean
} & FieldProps<string>

export const Secret: React.FC<SecretProps> = (props) => {
  const {
    className,
    description,
    initialValue,
    label,
    largeLabel,
    loadSecret: loadValue,
    onChange: onChangeFromProps,
    path,
    placeholder,
    readOnly,
    required = false,
    validate,
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
    errorMessage,
    onChange,
    showError,
    value = '',
  } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    required,
    validate: validate || defaultValidateFunction,
  })

  const loadExternalValue = React.useCallback(async (): Promise<null | string> => {
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
    if (!isValueLoaded) {
      await loadExternalValue()
    }

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
        id={path}
        name={path}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        tabIndex={isHidden ? -1 : 0}
        type="text"
        value={isHidden ? '••••••••••••••••••••••••••••••' : value || ''}
      />
      <Error message={errorMessage} showError={showError} />
      <Label
        actionsSlot={
          <Fragment>
            <Tooltip
              className={classes.tooltipButton}
              onClick={toggleVisibility}
              text={isHidden ? 'show' : 'hide'}
            >
              <EyeIcon closed={isHidden} size="large" />
            </Tooltip>
            <CopyToClipboard value={isValueLoaded ? value : loadExternalValue} />
          </Fragment>
        }
        className={largeLabel ? classes.largeLabel : ''}
        htmlFor={path}
        label={label}
        required={required}
      />
    </div>
  )
}
