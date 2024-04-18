'use client'
import Link from 'next/link'

import { Avatar } from '@root/components/Avatar'
import { FullLogo } from '@root/graphics/FullLogo'
import { useAuth } from '@root/providers/Auth'
import { DashboardBreadcrumbs } from '../DashboardBreadcrumbs'

import classes from './classes.module.scss'

export const CloudHeader = () => {
  const { user } = useAuth()

  return (
    <header className={classes.cloudHeader}>
      <FullLogo className={classes.logo} />
      <DashboardBreadcrumbs />
      <nav>
        {user ? (
          <div className={classes.loggedIn}>
            <ul>
              <li key={'new'}>
                <Link href="/new">New Project</Link>
              </li>
              <li key={'avatar'}>
                <Avatar />
              </li>
            </ul>
          </div>
        ) : (
          <div className={classes.loggedOut}>
            <ul>
              <li key={'login'}>
                <Link href="/login">Login</Link>
              </li>
              <li key={'signup'}>
                <Link href="/signup">Sign Up</Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}
