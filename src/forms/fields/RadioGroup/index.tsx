'use client'

import React, { useId } from 'react'

import type { FieldProps } from '../types'

import Error from '../../Error/index'
import Label from '../../Label/index'
import { useField } from '../useField/index'
import classes from './index.module.scss'

export type Option = {
  label: React.ReactElement | string
  value: string
}

const RadioGroup: React.FC<
  {
    hidden?: boolean
    layout?: 'horizontal' | 'vertical'
    options: Option[]
  } & FieldProps<string>
> = (props) => {
  const {
    className,
    hidden,
    initialValue,
    label,
    layout,
    onChange: onChangeFromProps,
    onClick,
    options,
    path,
    required = false,
    validate,
  } = props

  const id = useId()

  const defaultValidateFunction = React.useCallback(
    (fieldValue: string): string | true => {
      if (required && !fieldValue) {
        return 'Please make a selection.'
      }

      if (fieldValue && !options.find((option) => option && option.value === fieldValue)) {
        return 'This field has an invalid selection'
      }

      return true
    },
    [required, options],
  )

  const { errorMessage, onChange, showError, value } = useField<string>({
    initialValue,
    onChange: onChangeFromProps,
    path,
    required,
    validate: validate || defaultValidateFunction,
  })

  return (
    <div
      className={[className, classes.wrap, layout && classes[`layout--${layout}`]]
        .filter(Boolean)
        .join(' ')}
    >
      <Error message={errorMessage} showError={showError} />
      <Label htmlFor={path} label={label} required={required} />
      <ul className={classes.ul}>
        {options.map((option, index) => {
          const isSelected = String(option.value) === String(value)
          const optionId = `${id}-${index}`

          return (
            <li className={classes.li} key={index}>
              <label className={classes.radioWrap} htmlFor={optionId} onClick={onClick}>
                <input
                  checked={isSelected}
                  id={optionId}
                  onChange={() => {
                    onChange(option.value)
                  }}
                  type="radio"
                />
                <span
                  className={[
                    classes.radio,
                    isSelected && classes.selected,
                    hidden && classes.hidden,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
                <span className={classes.label}>{option.label}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default RadioGroup
