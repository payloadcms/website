import * as React from 'react'
import { useField } from '@forms/fields/useField/index.js'

import classes from './index.module.scss'

type RadioOption = {
  label: string
  value: string
}
export const CloudRadioGroup: React.FC<{
  path: string
  initialValue?: string
  options: RadioOption[]
  onChange: (option: any) => void // eslint-disable-line no-unused-vars
}> = ({ path, options, initialValue, onChange: onChangeFromProps }) => {
  const { value, onChange } = useField<string>({
    path,
    required: true,
    initialValue,
  })

  const handleChange = React.useCallback(
    option => {
      onChange(option.value)
      onChangeFromProps(option)
    },
    [onChange, onChangeFromProps],
  )

  return (
    <div className={classes.radioCards}>
      {options.map((option, index) => {
        const isSelected = String(option.value) === String(value)

        return (
          <div
            key={option.value}
            className={[isSelected && classes.isSelected].filter(Boolean).join(' ')}
          >
            <input
              type="radio"
              id={`teamID-${index}`}
              value={option.value}
              checked={isSelected}
              onChange={() => {
                handleChange(option)
              }}
              className={classes.radioInput}
            />
            <label htmlFor={`teamID-${index}`} className={classes.radioCard}>
              <div className={classes.styledRadioInput} />
              <span>{option.label}</span>
            </label>
          </div>
        )
      })}
    </div>
  )
}
