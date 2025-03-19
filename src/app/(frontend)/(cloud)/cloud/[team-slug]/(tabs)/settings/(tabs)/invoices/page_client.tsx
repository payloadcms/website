'use client'

import type { InvoicesResult } from '@cloud/_api/fetchInvoices'
import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import type { User } from '@root/payload-cloud-types'

import { CircleIconButton } from '@components/CircleIconButton/index'
import { Heading } from '@components/Heading/index'
import { Pill } from '@components/Pill/index'
import { checkTeamRoles } from '@root/utilities/check-team-roles'
import { formatDate } from '@root/utilities/format-date-time'
import { priceFromJSON } from '@root/utilities/price-from-json'
import Link from 'next/link'
import * as React from 'react'

import classes from './page.module.scss'
import { useInvoices } from './useInvoices'

export const TeamInvoicesPage: React.FC<{
  invoices: InvoicesResult
  team: TeamWithCustomer
  user: User
}> = ({ invoices: initialInvoices, team, user }) => {
  const isCurrentTeamOwner = checkTeamRoles(user, team, ['owner'])
  const hasCustomerID = team?.stripeCustomerID

  const {
    isLoading,
    loadMoreInvoices,
    result: invoices,
  } = useInvoices({
    initialInvoices,
    team,
  })

  return (
    <React.Fragment>
      {hasCustomerID && (
        <React.Fragment>
          {!isCurrentTeamOwner && (
            <p className={classes.error}>You must be an owner of this team to manage invoices.</p>
          )}
          {invoices !== null && (
            <React.Fragment>
              {Array.isArray(invoices?.data) && invoices?.data?.length === 0 && (
                <p>No invoices found.</p>
              )}
              {Array.isArray(invoices?.data) && invoices?.data?.length > 0 && (
                <React.Fragment>
                  <ul className={classes.list}>
                    {invoices &&
                      invoices?.data?.map((invoice, index) => {
                        const { created, hosted_invoice_url, lines, status, total } = invoice

                        const dateCreated = new Date(created * 1000)

                        return (
                          <li className={classes.invoice} key={`${invoice.id}-${index}`}>
                            <div className={classes.invoiceBlockLeft}>
                              <Heading
                                as="h5"
                                className={classes.invoiceDate}
                                element="h3"
                                margin={false}
                              >
                                {formatDate({ date: dateCreated })}
                              </Heading>
                              <span className={classes.invoiceStatus}>{status}</span>
                            </div>
                            <div className={classes.invoiceLines}>
                              {lines?.data?.map((line, lineIndex) => {
                                const { description, period } = line

                                return (
                                  <div
                                    className={classes.invoiceLine}
                                    key={`${invoice.id}-${line.id}-${lineIndex}`}
                                  >
                                    <span>
                                      {period?.start && period?.end && (
                                        <span className={classes.invoiceLinePeriod}>
                                          {'Period: '}
                                          {formatDate({ date: new Date(period.start * 1000) })}
                                          {' - '}
                                          {formatDate({ date: new Date(period.end * 1000) })}
                                        </span>
                                      )}
                                    </span>
                                    <span className={classes.invoiceLineDescription}>
                                      {description}
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                            <div className={classes.invoiceBlockRight}>
                              <Heading
                                as="h5"
                                className={[
                                  total < 0
                                    ? classes.invoiceTotalNegative
                                    : classes.invoiceTotalPositive,
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                                element="h4"
                                marginBottom={false}
                                marginTop={false}
                              >
                                {`${priceFromJSON(
                                  JSON.stringify({
                                    unit_amount: total,
                                  }),
                                )}`}
                              </Heading>
                              {hosted_invoice_url && (
                                <Link
                                  className={classes.invoiceLink}
                                  href={hosted_invoice_url}
                                  target="_blank"
                                >
                                  View Invoice
                                </Link>
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
