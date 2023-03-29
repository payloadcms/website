import * as React from 'react'

import classes from './index.module.scss'

type IndicatorProps = {
  status: 'success' | 'error' | 'warning'
}
export const Indicator: React.FC<IndicatorProps> = ({ status = 'success' }) => {
  return (
    <div className={[classes.indicator, classes[`status--${status}`]].filter(Boolean).join(' ')} />
  )
}
