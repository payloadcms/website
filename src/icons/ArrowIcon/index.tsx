import React from 'react'
import classes from '../index.module.scss'

export const ArrowIcon: React.FC<{
  rotation?: number
  size?: 'small' | 'large'
  className?: string
  bold?: boolean
}> = props => {
  const { rotation, size, className, bold } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 13 13"
      xmlns="http://www.w3.org/2000/svg"
      className={[className, classes.icon, size && classes[size], bold && classes.bold]
        .filter(Boolean)
        .join(' ')}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      <path d="M1 12L12.5 0.499965" className={classes.stroke} />
      <path d="M1 0.5H12.5V12" className={classes.stroke} />
    </svg>
  )
}
