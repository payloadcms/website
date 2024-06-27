'use client'
import Link from 'next/link'

import { Avatar } from '@root/components/Avatar/index.js'
import { FullLogo } from '@root/graphics/FullLogo/index.js'
import { useAuth } from '@root/providers/Auth/index.js'
import { DashboardBreadcrumbs } from '../DashboardBreadcrumbs/index.js'

import classes from './classes.module.scss'

export const CloudHeader = () => {
  const { user } = useAuth()

  return (
    <header className={classes.cloudHeader}>
      <FullLogo className={classes.logo} />
      <DashboardBreadcrumbs />
      <div className={classes.headerLinks}>
        {user ? (
          <ul>
            <li key={'new'}>
              <Link href="/new">New Project</Link>
            </li>
            <li key={'avatar'}>
              <Avatar />
            </li>
          </ul>
        ) : (
          <ul>
            <li key={'login'}>
              <Link href="/login">Login</Link>
            </li>
            <li key={'signup'}>
              <Link href="/signup">Sign Up</Link>
            </li>
          </ul>
        )}
      </div>
    </header>
  )
}
