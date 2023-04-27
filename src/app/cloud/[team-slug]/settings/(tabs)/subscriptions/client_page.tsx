'use client'

import * as React from 'react'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader'
import { useRouteData } from '@cloud/context'
import { useModal } from '@faceless-ui/modal'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { ModalWindow } from '@components/ModalWindow'
import { Pill } from '@components/Pill'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { formatDate } from '@root/utilities/format-date-time'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { useProducts } from './useProducts'
import { useSubscriptions } from './useSubscriptions'

import classes from './page.module.scss'

const modalSlug = 'cancel-subscription'

const Page = (props: { products: ReturnType<typeof useProducts>['result'] }) => {
  const { products } = props
  const { user } = useAuth()
  const { team } = useRouteData()
  const { closeModal, openModal } = useModal()
  const [subscriptionToDelete, setSubscriptionToDelete] = React.useState<string | null>(null)

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  const {
    result: subscriptions,
    isLoading,
    cancelSubscription,
  } = useSubscriptions({
    stripeCustomerID: team?.stripeCustomerID,
  })

  return (
    <React.Fragment>
      <SectionHeader
        title="Subscriptions"
        intro={
          <React.Fragment>
            {!hasCustomerID && (
              <p className={classes.error}>
                This team does not have a billing account. Please contact support to resolve this
                issue.
              </p>
            )}
          </React.Fragment>
        }
      />
      {hasCustomerID && (
        <React.Fragment>
          {!isCurrentTeamOwner && (
            <p className={classes.error}>
              You must be an owner of this team to manage subscriptions.
            </p>
          )}
          {subscriptions === null && <LoadingShimmer number={3} />}
          {subscriptions !== null && (
            <React.Fragment>
              {isLoading === 'loading' && <p>Loading...</p>}
              {isLoading === 'deleting' && <p>Canceling plan...</p>}
              {isLoading === 'updating' && <p>Updating...</p>}
              {Array.isArray(subscriptions) && subscriptions?.length > 0 && (
                <React.Fragment>
                  <ul className={classes.list}>
                    {subscriptions &&
                      subscriptions?.map(subscription => {
                        const { id: subscriptionID, metadata, status, trial_end } = subscription
                        const [item] = subscription.items.data
                        const matchingProduct = products?.find(
                          product => product.id === item.price.product,
                        )

                        return (
                          <li key={subscriptionID} className={classes.subscription}>
                            <div className={classes.subscriptionDetails}>
                              <div className={classes.subscriptionTitle}>
                                <Heading element="h5" marginBottom={false} marginTop={false}>
                                  {matchingProduct?.name || `Item ID: ${item?.id}`}
                                </Heading>
                                <Pill text={status} />
                              </div>
                              <Heading element="h6" marginBottom={false} marginTop={false}>
                                {`${priceFromJSON(JSON.stringify({ data: [item.price] }))}`}
                              </Heading>
                              {status === 'trialing' && trial_end && (
                                <div className={classes.freeTrialNotice}>
                                  {`After your free trial ends on ${formatDate({
                                    date: new Date(trial_end * 1000),
                                  })}, this plan will continue automatically.`}
                                </div>
                              )}
                            </div>
                            <Button
                              className={classes.subscriptionCancel}
                              appearance="primary"
                              size="pill"
                              onClick={() => {
                                setSubscriptionToDelete(subscriptionID)
                                openModal(modalSlug)
                              }}
                              label="Cancel plan"
                            />
                          </li>
                        )
                      })}
                  </ul>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      <ModalWindow slug={modalSlug}>
        <div className={classes.modalContent}>
          <Heading marginTop={false} as="h5">
            Are you sure you want to cancel this plan?
          </Heading>
          <p>
            {`Cancelling plan `}
            <b>{subscriptionToDelete}</b>
            {` will permanently delete any associated projects. This action cannot be undone.`}
          </p>
          <div className={classes.modalActions}>
            <Button
              label="cancel"
              appearance="secondary"
              onClick={() => {
                setSubscriptionToDelete(null)
                closeModal(modalSlug)
              }}
            />
            <Button
              label="delete"
              appearance="danger"
              onClick={() => {
                if (subscriptionToDelete) {
                  cancelSubscription(subscriptionToDelete)
                  closeModal(modalSlug)
                }
              }}
            />
          </div>
        </div>
      </ModalWindow>
    </React.Fragment>
  )
}

export const TeamSubscriptionsPage = () => {
  const { result: products } = useProducts()

  if (products === null) {
    return <LoadingShimmer number={3} />
  }

  return <Page products={products} />
}
