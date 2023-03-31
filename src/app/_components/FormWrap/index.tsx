import * as React from 'react'

import classes from './index.module.scss'

type Props = {
  children: React.ReactNode
  className?: string
}
export const FormWrap: React.FC<Props> = ({ children, className }) => {
  return <div className={[className, classes.formWrap].filter(Boolean).join(' ')}>{children}</div>
}
