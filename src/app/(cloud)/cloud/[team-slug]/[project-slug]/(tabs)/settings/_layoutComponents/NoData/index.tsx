import * as React from 'react'

import classes from './index.module.scss'

type Props = {
  message: string
}
export const NoData: React.FC<Props> = ({ message }) => {
  return <p className={classes.noData}>{message}</p>
}
