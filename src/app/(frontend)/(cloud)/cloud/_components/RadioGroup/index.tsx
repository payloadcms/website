import { useField } from '@forms/fields/useField/index'
import * as React from 'react'

import classes from './index.module.scss'

type RadioOption = {
  label: string
  value: string
}
export const CloudRadioGroup: React.FC<{
  initialValue?: string
  onChange: (option: any) => void
  options: RadioOption[]
  path: string
}> = ({ initialValue, onChange: onChangeFromProps, options, path }) => {
  const { onChange, value } = useField<string>({
    initialValue,
    path,
    required: true,
  })

  const handleChange = React.useCallback(
    (option) => {
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
            className={[isSelected && classes.isSelected].filter(Boolean).join(' ')}
            key={option.value}
          >
            <input
              checked={isSelected}
              className={classes.radioInput}
              id={`teamID-${index}`}
              onChange={() => {
                handleChange(option)
              }}
              type="radio"
              value={option.value}
            />
            <label className={classes.radioCard} htmlFor={`teamID-${index}`}>
              <div className={classes.styledRadioInput} />
              <span>{option.label}</span>
            </label>
          </div>
        )
      })}
    </div>
  )
}
