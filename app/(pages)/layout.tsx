'use client'

import * as React from 'react'

import { HeaderObserver } from '../../components/HeaderObserver'
import { useTheme } from '../../components/providers/Theme'

import classes from './layout.module.scss'

export default function ClientLayout({ children }) {
  const theme = useTheme()

  return (
    <React.Fragment>
      <HeaderObserver color={theme} />
      <div className={classes.layout}>{children}</div>
    </React.Fragment>
  )
}
