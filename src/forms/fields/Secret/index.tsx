import React from 'react'
import Label from '@forms/Label'

import { CopyToClipboard } from '@components/CopyToClipboard'
import { TooltipButton } from '@components/TooltipButton'
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

type SecretProps = FieldProps<string> & {
  loadSecret: () => Promise<string>
}

export const Secret: React.FC<SecretProps> = props => {
  const {
    path,
    required = false,
    validate = defaultValidate,
    label,
    placeholder,
    onChange: onChangeFromProps,
    initialValue,
    className,
    loadSecret: loadValue,
  } = props

  const [isValueLoaded, setIsValueLoaded] = React.useState(false)
  const [isHidden, setIsHidden] = React.useState(true)

  const {
    onChange,
    value = '',
    showError,
    errorMessage,
  } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    validate,
    required,
  })

  const loadExternalValue = React.useCallback(async (): Promise<string> => {
    try {
      const loadedValue = await loadValue()
      onChange(loadedValue)
      setIsValueLoaded(true)
      return loadedValue
    } catch (e) {
      console.error('Error loading external field value', e)
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
      <Error showError={showError} message={errorMessage} />

      <Label
        htmlFor={path}
        label={label}
        required={required}
        actionsSlot={
          <>
            <TooltipButton text={isHidden ? 'show' : 'hide'} onClick={toggleVisibility}>
              <EyeIcon />
            </TooltipButton>
            <CopyToClipboard value={isValueLoaded ? value : loadExternalValue} />
          </>
        }
      />

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
        value={isHidden ? '••••••••••' : value}
        tabIndex={isHidden ? -1 : 0}
      />
    </div>
  )
}
