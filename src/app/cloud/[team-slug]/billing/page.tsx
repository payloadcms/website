'use client'

import * as React from 'react'

import { Gutter } from '@components/Gutter'
import { useGetPaymentMethods } from '@root/utilities/use-cloud'
import { useRouteData } from '../../context'

import classes from './page.module.scss'

export default () => {
  const { team } = useRouteData()
  const { result: paymentMethods } = useGetPaymentMethods(team)

  const hasCards = paymentMethods?.length > 0

  return (
    <div className={classes.billing}>
      <Gutter className={classes.content}>
        {!hasCards && (
          <div className={classes.empty}>
            <p>{`You currently don't have any payment methods on file.`}</p>
          </div>
        )}
        {hasCards && (
          <div className={classes.subscriptions}>
            <h2>Payment methods</h2>
            <ul>
              {paymentMethods.map(paymentMethod => (
                <li key={paymentMethod.id}>
                  <p>{paymentMethod.card?.brand}</p>
                  <p>{paymentMethod.card?.last4}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Gutter>
    </div>
  )
}
