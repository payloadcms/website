import * as React from 'react'

import { Spinner } from '../Spinner/index'
import classes from './index.module.scss'

export type IndicatorProps = {
  className?: string
  spinner?: boolean
  status?: 'ERROR' | 'PENDING' | 'RUNNING' | 'SUCCESS' | 'SUSPENDED' | 'UNKNOWN'
}

export const Indicator: React.FC<IndicatorProps> = ({
  className,
  spinner = false,
  status = 'UNKNOWN',
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
