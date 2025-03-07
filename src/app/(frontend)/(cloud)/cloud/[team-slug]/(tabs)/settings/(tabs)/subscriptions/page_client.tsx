'use client'

import type { SubscriptionsResult } from '@cloud/_api/fetchSubscriptions'
import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import type { User } from '@root/payload-cloud-types'
import type { useGetPlans } from '@root/utilities/use-cloud-api'

import { Button } from '@components/Button/index'
import { CircleIconButton } from '@components/CircleIconButton/index'
import { Heading } from '@components/Heading/index'
import { ModalWindow } from '@components/ModalWindow/index'
import { Pill } from '@components/Pill/index'
import { useModal } from '@faceless-ui/modal'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { formatDate } from '@root/utilities/format-date-time'
import { priceFromJSON } from '@root/utilities/price-from-json'
import Link from 'next/link'
import * as React from 'react'

import classes from './page.module.scss'
import { useSubscriptions } from './useSubscriptions'

const modalSlug = 'cancel-subscription'

export const TeamSubscriptionsPage = (props: {
  plans: ReturnType<typeof useGetPlans>['result']
  subscriptions: SubscriptionsResult
  team: TeamWithCustomer
  user: User
}) => {
  const { plans, subscriptions: initialSubscriptions, team, user } = props
  const { closeModal, openModal } = useModal()
  const subscriptionToDelete = React.useRef<null | string>(null)

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  const {
    cancelSubscription,
    error: subscriptionsError,
    isLoading,
    loadMoreSubscriptions,
    result: subscriptions,
  } = useSubscriptions({
    initialSubscriptions,
    team,
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
                    {subscriptions?.data?.map((subscription) => {
                      const { id: subscriptionID, project, status, trial_end } = subscription
                      const [item] = subscription.items.data
                      const plan = plans?.find((p) => p.stripeProductID === item.price.product)

                      const trialEndDate = new Date(trial_end * 1000)

                      return (
                        <li className={classes.subscription} key={subscriptionID}>
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
                                appearance="primary"
                                className={classes.subscriptionCancel}
                                label="Cancel plan"
                                onClick={() => {
                                  subscriptionToDelete.current = subscriptionID
                                  openModal(modalSlug)
                                }}
                                size="pill"
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
          <Heading as="h4" marginTop={false}>
            Are you sure you want to cancel this subscription?
          </Heading>
          <p>
            {`Canceling subscription `}
            <b>{subscriptionToDelete.current}</b>
            {` will permanently delete any associated projects. This action cannot be undone.`}
          </p>
          <div className={classes.modalActions}>
            <Button
              appearance="secondary"
              label="Cancel"
              onClick={() => {
                subscriptionToDelete.current = null
                closeModal(modalSlug)
              }}
            />
            <Button
              appearance="danger"
              label="Delete"
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
