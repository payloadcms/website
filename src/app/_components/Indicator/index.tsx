import * as React from 'react'

import { Spinner } from '../Spinner'

import classes from './index.module.scss'

type IndicatorProps = {
  status: 'success' | 'error' | 'warning' | 'info'
  spinner?: boolean
}

export const Indicator: React.FC<IndicatorProps> = ({ status = 'success', spinner = false }) => {
  return (
    <div className={[classes.indicator, classes[`status--${status}`]].filter(Boolean).join(' ')}>
      {spinner && <Spinner />}
    </div>
  )
}
