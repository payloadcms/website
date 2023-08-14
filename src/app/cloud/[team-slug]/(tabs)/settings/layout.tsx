import * as React from 'react'
import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam'
import { Sidebar } from '@cloud/_components/Sidebar'
import { cloudSlug } from '@cloud/slug'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Gutter } from '@components/Gutter'
import { MissingDefaultPaymentMethod } from './(tabs)/MissingDefaultPaymentMethod'

import classes from './layout.module.scss'

export default async function TeamSettingsLayout({ params: { 'team-slug': teamSlug }, children }) {
  // Note: this fetch will get deduped by the page
  // each page within this layout calls this same function
  // Next.js will only call it once
  const team = await fetchTeamWithCustomer(teamSlug)

  // display an error to the user if the team has no default payment method
  const defaultPaymentMethod = team?.stripeCustomer?.invoice_settings?.default_payment_method

  return (
    <Gutter>
      <Grid className={classes.gridWrap}>
        <Cell cols={3} start={1} colsS={8}>
          <Sidebar
            routes={[
              {
                label: 'General',
                url: `/${cloudSlug}/${teamSlug}/settings`,
              },
              {
                label: 'Team Members',
                url: `/${cloudSlug}/${teamSlug}/settings/members`,
              },
              {
                label: 'Billing',
                url: `/${cloudSlug}/${teamSlug}/settings/billing`,
              },
              {
                label: 'Subscriptions',
                url: `/${cloudSlug}/${teamSlug}/settings/subscriptions`,
              },
              {
                label: 'Invoices',
                url: `/${cloudSlug}/${teamSlug}/settings/invoices`,
              },
            ]}
          />
        </Cell>
        <Cell start={4} cols={9} startS={1}>
          {!defaultPaymentMethod && <MissingDefaultPaymentMethod teamSlug={teamSlug} />}
          {children}
        </Cell>
      </Grid>
    </Gutter>
  )
}
