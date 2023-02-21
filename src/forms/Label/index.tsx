import React from 'react'

import { Props } from './types'

import classes from './index.module.scss'

const LabelOnly: React.FC<Props> = props => {
  const { htmlFor, required, label } = props

  return (
    <label htmlFor={htmlFor} className={classes.label}>
      {label}
      {required && <span className={classes.required}>*</span>}
    </label>
  )
}

const Label: React.FC<Props> = props => {
  const { label, actionsSlot } = props

  if (label) {
    if (actionsSlot) {
      return (
        <div className={classes.labelWithActions}>
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
