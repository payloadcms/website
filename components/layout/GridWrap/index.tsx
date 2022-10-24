import React from 'react'

import classes from './styles.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
}
export const GridWrap: React.FC<Props> = ({ children, className }) => {
  return <div className={[classes.gridWrap, className].filter(Boolean).join(' ')}>{children}</div>
}
