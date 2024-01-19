import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam'
import { Sidebar } from '@cloud/_components/Sidebar'
import { cloudSlug } from '@cloud/slug'

import { Gutter } from '@components/Gutter'
import { TeamBillingMessages } from './TeamBillingMessages'

import classes from './layout.module.scss'

export default async ({ params: { 'team-slug': teamSlug }, children }) => {
  // Note: this fetch will get deduped by the page
  // each page within this layout calls this same function
  // Next.js will only call it once
  const team = await fetchTeamWithCustomer(teamSlug)

  return (
    <Gutter>
      <div className={[classes.gridWrap, 'grid'].filter(Boolean).join(' ')}>
        <div
          cols={3}
          start={1}
          colsS={8}
          className={['cols-4 start-1 cols-s-8'].filter(Boolean).join(' ')}
        >
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
        <div
          start={4}
          cols={9}
          startS={1}
          className={['start-5 cols-10 start-s-1'].filter(Boolean).join(' ')}
        >
          <TeamBillingMessages team={team} />
          {children}
        </div>
      </div>
    </Gutter>
  )
}
