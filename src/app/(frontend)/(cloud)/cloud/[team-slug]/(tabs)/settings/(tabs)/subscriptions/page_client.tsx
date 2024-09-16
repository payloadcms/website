'use client'

import * as React from 'react'
import { SubscriptionsResult } from '@cloud/_api/fetchSubscriptions.js'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { useModal } from '@faceless-ui/modal'
import Link from 'next/link'

import { Button } from '@components/Button/index.js'
import { CircleIconButton } from '@components/CircleIconButton/index.js'
import { Heading } from '@components/Heading/index.js'
import { ModalWindow } from '@components/ModalWindow/index.js'
import { Pill } from '@components/Pill/index.js'
import { User } from '@root/payload-cloud-types.js'
import { checkTeamRoles } from '@root/utilities/check-team-roles.js'
import { formatDate } from '@root/utilities/format-date-time.js'
import { priceFromJSON } from '@root/utilities/price-from-json.js'
import { useGetPlans } from '@root/utilities/use-cloud-api.js'
import { useSubscriptions } from './useSubscriptions.js'

import classes from './page.module.scss'

const modalSlug = 'cancel-subscription'

export const TeamSubscriptionsPage = (props: {
  plans: ReturnType<typeof useGetPlans>['result']
  team: TeamWithCustomer
  subscriptions: SubscriptionsResult
  user: User
}) => {
  const { plans, team, user, subscriptions: initialSubscriptions } = props
  const { closeModal, openModal } = useModal()
  const subscriptionToDelete = React.useRef<string | null>(null)

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  const {
    result: subscriptions,
    isLoading,
    cancelSubscription,
    loadMoreSubscriptions,
    error: subscriptionsError,
  } = useSubscriptions({
    team,
    initialSubscriptions,
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
          {subscriptions !== null && (
            <React.Fragment>
              {isLoading === 'deleting' && <p>Canceling subscription...</p>}
              {Array.isArray(subscriptions?.data) && subscriptions?.data?.length === 0 && (
                <p>No subscriptions found.</p>
              )}
              {Array.isArray(subscriptions?.data) && subscriptions?.data?.length > 0 && (
                <React.Fragment>
                  <ul className={classes.list}>
                    {subscriptions?.data?.map(subscription => {
                      const { id: subscriptionID, project, status, trial_end } = subscription
                      const [item] = subscription.items.data
                      const plan = plans?.find(p => p.stripeProductID === item.price.product)

                      const trialEndDate = new Date(trial_end * 1000)

                      return (
                        <li key={subscriptionID} className={classes.subscription}>
                          <div className={classes.subscriptionDetails}>
                            {plan?.name && (
                              <div className={classes.productName}>{`${plan?.name} Plan`}</div>
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
                                  subscriptionToDelete.current = subscriptionID
                                  openModal(modalSlug)
                                }}
                                label="Cancel plan"
                              />
                            </div>
                            <Heading element="h6" marginBottom={false} marginTop={false}>
                              {`${priceFromJSON(JSON.stringify(item.price))}`}
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
          <Heading marginTop={false} as="h4">
            Are you sure you want to cancel this subscription?
          </Heading>
          <p>
            {`Canceling subscription `}
            <b>{subscriptionToDelete.current}</b>
            {` will permanently delete any associated projects. This action cannot be undone.`}
          </p>
          <div className={classes.modalActions}>
            <Button
              label="Cancel"
              appearance="secondary"
              onClick={() => {
                subscriptionToDelete.current = null
                closeModal(modalSlug)
              }}
            />
            <Button
              label="Delete"
              appearance="danger"
              onClick={() => {
                if (subscriptionToDelete.current) {
                  cancelSubscription(subscriptionToDelete.current)
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
