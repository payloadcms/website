'use client'

import type { TopBar as TopBarType } from '@root/payload-types'

import { TopBar } from '@components/TopBar'
import { Avatar } from '@root/components/Avatar/index'
import { FullLogo } from '@root/graphics/FullLogo/index'
import { useAuth } from '@root/providers/Auth/index'
import Link from 'next/link'
import * as React from 'react'

import { DashboardBreadcrumbs } from '../DashboardBreadcrumbs/index'
import classes from './classes.module.scss'

export const CloudHeader: React.FC<{
  topBar?: TopBarType
}> = ({ topBar }) => {
  const { user } = useAuth()
  const [hideTopBar, setHideTopBar] = React.useState(false)

  React.useEffect(() => {
    if (!topBar?.enableTopBar) {
      document.documentElement.style.setProperty('--top-bar-height', '0px')
      return
    }

    const handleScroll = () => {
      setHideTopBar(window.scrollY > 30)
      document.documentElement.style.setProperty(
        '--top-bar-height',
        window.scrollY > 30 ? '0px' : '3rem',
      )
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [topBar?.enableTopBar])

  return (
    <div className={classes.wrapper}>
      {topBar?.enableTopBar && (
        <div
          className={[classes.topBar, hideTopBar && classes.topBarHidden].filter(Boolean).join(' ')}
          id="topBar"
        >
          <TopBar {...topBar} />
        </div>
      )}
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
