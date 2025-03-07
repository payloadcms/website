import React from 'react'

import type { Props } from './types'

import classes from './index.module.scss'

const Error: React.FC<Props> = (props) => {
  const { className, message, showError } = props

  if (showError) {
    return <p className={[classes.error, className].filter(Boolean).join(' ')}>{message}</p>
  }

  return null
}

export default Error
