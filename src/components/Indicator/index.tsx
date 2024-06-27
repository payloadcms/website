import * as React from 'react'

import { Spinner } from '../Spinner/index.js'

import classes from './index.module.scss'

export type IndicatorProps = {
  status?: 'UNKNOWN' | 'PENDING' | 'RUNNING' | 'ERROR' | 'SUCCESS' | 'SUSPENDED'
  spinner?: boolean
  className?: string
}

export const Indicator: React.FC<IndicatorProps> = ({
  status = 'UNKNOWN',
  spinner = false,
  className,
}) => {
  return (
    <div
      className={[className, classes.indicator, classes[`status--${status}`]]
        .filter(Boolean)
        .join(' ')}
    >
      {spinner && <Spinner />}
    </div>
  )
}
