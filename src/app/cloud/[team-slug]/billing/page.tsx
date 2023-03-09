'use client'

import * as React from 'react'
import Link from 'next/link'

import { Gutter } from '@components/Gutter'
import { useRouteData } from '../../context'

import classes from './page.module.scss'

export default () => {
  const { team } = useRouteData()

  const hasSubscriptions = team?.subscriptions?.length > 0

  return (
    <div className={classes.billing}>
      <Gutter className={classes.content}>
        {!hasSubscriptions && (
          <div className={classes.empty}>
            <p>
              {`You don't have any current subscriptions. `}
              <Link href="/new">Create a project</Link>
              {` to get started.`}
            </p>
          </div>
        )}
        {hasSubscriptions && (
          <div className={classes.subscriptions}>
            <h2>Subscriptions</h2>
            <ul>
              {team.subscriptions.map(subscription => (
                <li key={subscription.id}>
                  <p>
                    {typeof subscription.plan === 'string'
                      ? subscription.plan
                      : subscription.plan?.name}
                  </p>
                  <p>{subscription.stripeProductID}</p>
                  <p>{subscription.status}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Gutter>
    </div>
  )
}
