import * as React from 'react'
import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { Sidebar } from '@cloud/_components/Sidebar'
import { cloudSlug } from '@cloud/slug'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Gutter } from '@components/Gutter'
import { BadSubscriptionStatus } from './BadSubscriptionStatus'

import classes from './layout.module.scss'

const settingsSlug = 'settings'

export default async ({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
  children,
}) => {
  // Note: this fetch will get deduped by the page
  // each page within this layout calls this same function
  // Next.js will only call it once
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })

  // display an error if the project has a bad subscription status
  const subscriptionsStatus = project?.stripeSubscriptionStatus
  const hasBadSubscriptionStatus = ['incomplete', 'incomplete_expired', 'past_due', 'unpaid'].some(
    status => status === subscriptionsStatus,
  )

  return (
    <Gutter>
      <Grid className={classes.gridWrap}>
        <Cell cols={3} start={1} colsS={8}>
          <Sidebar
            routes={[
              {
                label: 'General',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}`,
              },
              {
                label: 'Environment Variables',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/environment-variables`,
              },
              {
                label: 'Domains',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/domains`,
              },
              {
                label: 'Email',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/email`,
              },
              {
                label: 'Ownership',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/ownership`,
              },
              {
                label: 'Plan',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/plan`,
              },
              {
                label: 'Billing',
                url: `/${cloudSlug}/${teamSlug}/${projectSlug}/${settingsSlug}/billing`,
              },
            ]}
          />
        </Cell>
        <Cell start={4} cols={9} startS={1}>
          {hasBadSubscriptionStatus && (
            <BadSubscriptionStatus
              subscriptionStatus={subscriptionsStatus}
              teamSlug={teamSlug}
              projectSlug={projectSlug}
            />
          )}
          {children}
        </Cell>
      </Grid>
    </Gutter>
  )
}
