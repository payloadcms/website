import React from 'react'

import classes from './index.module.scss'

export const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <p className={[classes.label, className].filter(Boolean).join(' ')}>{children}</p>
}
