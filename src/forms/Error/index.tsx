import React from 'react'

import { Props } from './types.js'

import classes from './index.module.scss'

const Error: React.FC<Props> = props => {
  const { showError, message, className } = props

  if (showError) {
    return <p className={[classes.error, className].filter(Boolean).join(' ')}>{message}</p>
  }

  return null
}

export default Error
