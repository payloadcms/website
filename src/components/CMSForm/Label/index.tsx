import React from 'react'

import type { Props } from './types'

import classes from './index.module.scss'

const LabelOnly: React.FC<Props> = (props) => {
  const { className, htmlFor, label, required } = props

  return (
    <label className={[classes.label, className].filter(Boolean).join(' ')} htmlFor={htmlFor}>
      {label}
      {required && <span className={classes.required}>*</span>}
    </label>
  )
}

const Label: React.FC<Props> = (props) => {
  const { actionsClassName, actionsSlot, label, margin } = props

  if (label) {
    if (actionsSlot) {
      return (
        <div
          className={[
            classes.labelWithActions,
            margin === false && classes.noMargin,
            actionsClassName,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <LabelOnly {...props} />
          <div className={classes.actions}>{actionsSlot}</div>
        </div>
      )
    }

    return <LabelOnly {...props} />
  }

  return null
}

export default Label
