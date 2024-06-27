import * as React from 'react'
import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { Sidebar } from '@cloud/_components/Sidebar/index.js'
import { cloudSlug } from '@cloud/slug.js'

import { Gutter } from '@components/Gutter/index.js'
import { TeamBillingMessages } from './TeamBillingMessages/index.js'

import classes from './layout.module.scss'

export default async ({ params: { 'team-slug': teamSlug }, children }) => {
  // Note: this fetch will get deduped by the page
  // each page within this layout calls this same function
  // Next.js will only call it once
  const team = await fetchTeamWithCustomer(teamSlug)

  return (
    <Gutter className="grid">
      <div className="cols-4 cols-m-8">
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
      </div>
      <div className="cols-12">
        <TeamBillingMessages team={team} />
        {children}
      </div>
    </Gutter>
  )
}
