import * as React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
}
export const BorderBox: React.FC<Props> = ({ children, className }) => {
  return <div className={[className, classes.borderBox].filter(Boolean).join(' ')}>{children}</div>
}
