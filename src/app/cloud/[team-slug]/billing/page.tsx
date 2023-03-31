'use client'

import * as React from 'react'

import { Gutter } from '@components/Gutter'
import { useGetPaymentMethods } from '@root/utilities/use-cloud-api'
import { useRouteData } from '../../context'

import classes from './page.module.scss'

export default () => {
  const { team } = useRouteData()
  const { result: paymentMethods } = useGetPaymentMethods(team)

  const hasCards = paymentMethods?.length > 0

  return (
    <div className={classes.billing}>
      <Gutter className={classes.content}>
        <h2>Payment methods</h2>
        {!hasCards && (
          <div className={classes.empty}>
            <p>{`You currently don't have any payment methods on file.`}</p>
          </div>
        )}
        {hasCards && (
          <ul className={classes.paymentMethods}>
            {paymentMethods.map(paymentMethod => (
              <li key={paymentMethod.id} className={classes.paymentMethod}>
                <p>{`${paymentMethod?.card?.brand} ending in ${paymentMethod?.card?.last4}`}</p>
              </li>
            ))}
          </ul>
        )}
      </Gutter>
    </div>
  )
}
