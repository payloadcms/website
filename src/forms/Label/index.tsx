import React from 'react'
import { Props } from './types'

import classes from './index.module.scss'

const Label: React.FC<Props> = props => {
  const { htmlFor, required, label } = props

  if (label) {
    return (
      <label htmlFor={htmlFor} className={classes.label}>
        {label}
        {required && <span className={classes.required}>*</span>}
      </label>
    )
  }

  return null
}

export default Label
