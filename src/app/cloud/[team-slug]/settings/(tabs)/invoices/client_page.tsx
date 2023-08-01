'use client'

import * as React from 'react'
import { SectionHeader } from '@cloud/[team-slug]/[project-slug]/(tabs)/settings/_layoutComponents/SectionHeader'
import { useRouteData } from '@cloud/context'

import { Button } from '@components/Button'
import { CircleIconButton } from '@components/CircleIconButton'
import { Heading } from '@components/Heading'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { Pill } from '@components/Pill'
import { useAuth } from '@root/providers/Auth'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { formatDate } from '@root/utilities/format-date-time'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { useInvoices } from './useInvoices'

import classes from './page.module.scss'

export const TeamInvoicesPage = () => {
  const { user } = useAuth()
  const { team } = useRouteData()

  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  const {
    result: invoices,
    isLoading,
    loadMoreInvoices,
  } = useInvoices({
    stripeCustomerID: team?.stripeCustomerID,
  })

  return (
    <React.Fragment>
      <SectionHeader
        title="Invoices"
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
            <p className={classes.error}>You must be an owner of this team to manage invoices.</p>
          )}
          {invoices === null && <LoadingShimmer number={3} />}
          {invoices !== null && (
            <React.Fragment>
              <ul className={classes.list}>
                {invoices &&
                  invoices?.data?.map((invoice, index) => {
                    const { status, total, created, lines } = invoice

                    const dateCreated = new Date(created * 1000)

                    return (
                      <li key={`${invoice.id}-${index}`} className={classes.invoice}>
                        <div className={classes.invoiceDetails}>
                          <div className={classes.invoiceTitle}>
                            <Heading element="h5" marginBottom={false} marginTop={false}>
                              {formatDate({ date: dateCreated })}
                            </Heading>
                            <Pill text={status} />
                          </div>
                          <Heading
                            element="h6"
                            marginBottom={false}
                            marginTop={false}
                            className={[
                              total < 0
                                ? classes.invoiceTotalNegative
                                : classes.invoiceTotalPositive,
                            ]
                              .filter(Boolean)
                              .join(' ')}
                          >
                            {`${priceFromJSON(
                              JSON.stringify({
                                unit_amount: total,
                              }),
                            )}`}
                          </Heading>
                        </div>
                        {lines?.data?.map((line, lineIndex) => {
                          const { description, period } = line

                          return (
                            <div
                              className={classes.invoiceLine}
                              key={`${invoice.id}-${line.id}-${lineIndex}`}
                            >
                              <p className={classes.invoiceLineDescription}>{description}</p>
                              <p>
                                {period?.start && period?.end && (
                                  <span className={classes.invoiceLinePeriod}>
                                    {'Period: '}
                                    {formatDate({ date: new Date(period.start * 1000) })}
                                    {' - '}
                                    {formatDate({ date: new Date(period.end * 1000) })}
                                  </span>
                                )}
                              </p>
                            </div>
                          )
                        })}
                      </li>
                    )
                  })}
              </ul>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
      {invoices?.has_more && (
        <div className={classes.loadMore}>
          <CircleIconButton
            icon="add"
            label={isLoading === 'loading' ? 'Loading...' : 'Load more'}
            onClick={loadMoreInvoices}
          />
        </div>
      )}
    </React.Fragment>
  )
}
