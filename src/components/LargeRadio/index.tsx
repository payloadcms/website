import { Pill } from '@components/Pill/index'
import { CheckIcon } from '@root/icons/CheckIcon/index'
import React, { Fragment } from 'react'

import classes from './index.module.scss'

export const LargeRadio: React.FC<{
  checked?: boolean
  disabled?: boolean
  id: string
  label: React.ReactNode | string
  name?: string
  onChange?: (value?: any) => void
  pillLabel?: string
  price?: string
  value: any
}> = (props) => {
  const { id, name, checked, disabled, label, onChange, pillLabel, price, value } = props

  return (
    <Fragment key={value}>
      <label
        className={[classes.largeRadio, checked && classes.checked, disabled && classes.disabled]
          .filter(Boolean)
          .join(' ')}
        htmlFor={id}
      >
        <div className={classes.checkmark}>
          {checked && <CheckIcon size="medium" />}
          <input
            checked={checked}
            className={classes.radio}
            disabled={disabled}
            id={id}
            name={name}
            onChange={() => {
              if (!disabled && typeof onChange === 'function') {
                onChange(value)
              }
            }}
            type="checkbox"
            value={id}
          />
        </div>
        <div className={classes.content}>
          <p className={classes.name}>
            {label}
            {pillLabel && <Pill className={classes.pill} text={pillLabel} />}
          </p>
          {price && <p className={classes.price}>{price}</p>}
        </div>
      </label>
      {disabled && (
        <p>
          Because your repo is connected to a GitHub organization, you are not eligible for the free
          tier.
        </p>
      )}
    </Fragment>
  )
}
