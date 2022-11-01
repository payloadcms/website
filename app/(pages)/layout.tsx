import * as React from 'react'

import classes from './layout.module.scss'

export default async function Layout({ children }) {
  return <div className={classes.layout}>{children}</div>
}
