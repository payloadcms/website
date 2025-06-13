'use client'
import { Avatar } from '@root/components/Avatar/index'
import { FullLogo } from '@root/graphics/FullLogo/index'
import { useAuth } from '@root/providers/Auth/index'
import Link from 'next/link'

import { DashboardBreadcrumbs } from '../DashboardBreadcrumbs/index'
import classes from './classes.module.scss'

export const CloudHeader: React.FC<{
  children?: React.ReactNode
}> = ({ children }) => {
  const { user } = useAuth()

  return (
    <div className={classes.wrapper}>
      {children}
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
