import React from 'react'
import classes from '../index.module.scss'

export const SearchIcon: React.FC<{
  rotation?: number
  color?: string
  size?: 'small' | 'large'
  className?: string
  bold?: boolean
}> = props => {
  const { color, rotation, size, className, bold } = props

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 15 16"
      xmlns="http://www.w3.org/2000/svg"
      className={[
        className,
        classes.icon,
        color && classes[color],
        size && classes[size],
        bold && classes.bold,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
      }}
    >
      <circle cx="6.20691" cy="6.96344" r="5" className={classes.stroke} />
      <path d="M10.2069 10.9634L13.7069 14.4634" className={classes.stroke} />
    </svg>
  )
}
