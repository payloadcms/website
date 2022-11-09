import React from 'react'
import classes from './index.module.scss'

export type Props = {
  children: React.ReactNode
  className?: string
}

const Tooltip: React.FC<Props> = ({ children, className }) => {
  const tooltipClasses = [classes.tooltip, className].filter(Boolean).join(' ')

  return (
    <aside className={tooltipClasses}>
      {children}
      <span className={classes.caret} />
    </aside>
  )
}

export default Tooltip
