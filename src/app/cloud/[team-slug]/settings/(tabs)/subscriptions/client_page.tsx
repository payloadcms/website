'use client'

import * as React from 'react'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader'
import { useRouteData } from '@cloud/context'
import { useModal } from '@faceless-ui/modal'
import Link from 'next/link'

import { Button } from '@components/Button'
import { CircleIconButton } from '@components/CircleIconButton'
import { Heading } from '@components/Heading'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { ModalWindow } from '@components/ModalWindow'
import { Pill } from '@components/Pill'
import { Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { formatDate } from '@root/utilities/format-date-time'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { useProducts } from './useProducts'
import { useSubscriptions } from './useSubscriptions'

import classes from './page.module.scss'

const modalSlug = 'cancel-subscription'

const Page = (props: { products: ReturnType<typeof useProducts>['result']; team: Team }) => {
  const { products, team } = props
  const { user } = useAuth()
  const { closeModal, openModal } = useModal()
  const [subscriptionToDelete, setSubscriptionToDelete] = React.useState<string | null>(null)

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  const {
    result: subscriptions,
    isLoading,
    cancelSubscription,
    loadMoreSubscriptions,
    error: subscriptionsError,
  } = useSubscriptions({
    stripeCustomerID: team?.stripeCustomerID,
  })

  return (
    <React.Fragment>
      {hasCustomerID && (
        <React.Fragment>
          {!isCurrentTeamOwner && (
            <p className={classes.error}>
              You must be an owner of this team to manage subscriptions.
            </p>
          )}
          {subscriptionsError && <p className={classes.error}>{subscriptionsError}</p>}
          {subscriptions === null && <LoadingShimmer number={3} />}
          {subscriptions !== null && (
            <React.Fragment>
              {isLoading === 'deleting' && <p>Canceling subscription...</p>}
              {Array.isArray(subscriptions?.data) && subscriptions?.data?.length > 0 && (
                <React.Fragment>
                  <ul className={classes.list}>
                    {subscriptions?.data?.map(subscription => {
                      const { id: subscriptionID, project, status, trial_end } = subscription
                      const [item] = subscription.items.data
                      const matchingProduct = products?.find(
                        product => product.id === item.price.product,
                      )

                      const trialEndDate = new Date(trial_end * 1000)

                      return (
                        <li key={subscriptionID} className={classes.subscription}>
                          <div className={classes.subscriptionDetails}>
                            {matchingProduct?.name && (
                              <div className={classes.productName}>
                                {`${matchingProduct?.name}`}
                              </div>
                            )}
                            <div className={classes.subscriptionTitleWrapper}>
                              <div className={classes.subscriptionTitle}>
                                <Heading element="h5" marginBottom={false} marginTop={false}>
                                  {project ? (
                                    <Link href={`/cloud/${team.slug}/${project.slug}`}>
                                      {project.name}
                                    </Link>
                                  ) : (
                                    <span>{item?.id}</span>
                                  )}
                                </Heading>
                                <Pill
                                  text={
                                    status === 'trialing'
                                      ? `Trial ends ${formatDate({
                                          date: trialEndDate,
                                          format: 'shortDateStamp',
                                        })}`
                                      : status
                                  }
                                />
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
                            </div>
                            <Heading element="h6" marginBottom={false} marginTop={false}>
                              {`${priceFromJSON(JSON.stringify({ data: [item.price] }))}`}
                            </Heading>
                            {status === 'trialing' && trial_end && (
                              <div>
                                {`After your free trial ends on ${formatDate({
                                  date: trialEndDate,
                                })}, this plan will continue automatically.`}
                              </div>
                            )}
                          </div>
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
      {subscriptions?.has_more && (
        <div className={classes.loadMore}>
          <CircleIconButton
            icon="add"
            label={isLoading === 'loading' ? 'Loading...' : 'Load more'}
            onClick={loadMoreSubscriptions}
          />
        </div>
      )}
      <ModalWindow slug={modalSlug}>
        <div className={classes.modalContent}>
          <Heading marginTop={false} as="h5">
            Are you sure you want to cancel this subscription?
          </Heading>
          <p>
            {`Canceling subscription `}
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
  const { team } = useRouteData()
  const { result: products } = useProducts()

  const hasCustomerID = team?.stripeCustomerID

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
      {products === null ? <LoadingShimmer number={3} /> : <Page products={products} team={team} />}
    </React.Fragment>
  )
}
