import React from 'react'

import './index.scss'

interface CardGroupProps {
  children: React.ReactNode
  variant?: 'compact' | 'default' | null
}

export const CardGroup: React.FC<CardGroupProps> = ({ children, variant = 'default' }) => {
  const classes = ['docs-card-group', `docs-card-group--${variant ?? 'default'}`]

  return <div className={classes.join(' ')}>{children}</div>
}
