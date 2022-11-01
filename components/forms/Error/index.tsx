import React from 'react'
import { Props } from './types'
import Tooltip from '../../components/Tooltip'
import classes from './index.module.scss'

const Error: React.FC<Props> = props => {
  const { showError, message } = props

  if (showError) {
    return { message }
    // <Tooltip
    //   type="error"
    //   className={classes.error}
    // >
    //   {message}
    // </Tooltip>
  }

  return null
}

export default Error
