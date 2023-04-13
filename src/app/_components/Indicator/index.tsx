import * as React from 'react'

import { Spinner } from '../Spinner'

import classes from './index.module.scss'

type IndicatorProps = {
  status: 'success' | 'error' | 'warning' | 'info'
  spinner?: boolean
  className?: string
}

export const Indicator: React.FC<IndicatorProps> = ({
  status = 'success',
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
