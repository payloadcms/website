'use client'
import { Avatar } from '@root/components/Avatar/index'
import { FullLogo } from '@root/graphics/FullLogo/index'
import { useAuth } from '@root/providers/Auth/index'
import Link from 'next/link'
import * as React from 'react'

import { DashboardBreadcrumbs } from '../DashboardBreadcrumbs/index'
import classes from './classes.module.scss'

export const CloudHeader: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const { user } = useAuth()
  const [hideTopBar, setHideTopBar] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setHideTopBar(window.scrollY > 30)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={classes.wrapper}>
      <div
        className={[classes.topBar, hideTopBar && classes.topBarHidden].filter(Boolean).join(' ')}
        id="topBar"
      >
        {children}
      </div>
      <header className={classes.cloudHeader}>
        <FullLogo className={classes.logo} />
        <DashboardBreadcrumbs />
        <div className={classes.headerLinks}>
          {user ? <Avatar /> : <Link href="/login">Login</Link>}
        </div>
      </header>
    </div>
  )
}
