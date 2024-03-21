'use client'
import { Avatar } from '@root/components/Avatar'
import { useAuth } from '@root/providers/Auth'
import { DashboardBreadcrumbs } from '../DashboardBreadcrumbs'

import classes from './classes.module.scss'

export const CloudHeader = () => {
  const { user } = useAuth()

  return (
    <header className={classes.cloudHeader}>
      <DashboardBreadcrumbs />
      <nav>
        <ul>
          <li key={'new'}>
            <a href="/new">New Project</a>
          </li>
          <li key={'docs'}>
            <a href="/docs">Docs</a>
          </li>
          {user ? (
            <>
              <li key={'logout'}>
                <a href="/logout">Logout</a>
              </li>
              <li key={'avatar'}>
                <Avatar />
              </li>
            </>
          ) : (
            <li key={'login'}>
              <a href="/login">Login</a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
