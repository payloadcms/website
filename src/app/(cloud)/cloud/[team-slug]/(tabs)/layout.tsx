import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { DashboardTabs } from '@cloud/_components/DashboardTabs/index.js'
import { teamHasDefaultPaymentMethod } from '@cloud/_utilities/teamHasDefaultPaymentMethod.js'
import { cloudSlug } from '@cloud/slug.js'

import { Gutter } from '@components/Gutter/index.js'

export default async props => {
  const {
    children,
    params: { 'team-slug': teamSlug },
  } = props

  // Note: this fetch will get deduped by the page
  // each page within this layout calls this same function
  // Next.js will only call it once
  const team = await fetchTeamWithCustomer(teamSlug)

  return (
    <>
      <Gutter>
        <h2>{team.name}</h2>
        <DashboardTabs
          tabs={{
            [teamSlug]: {
              label: 'Team Projects',
              href: `/${cloudSlug}/${teamSlug}`,
            },
            settings: {
              label: 'Team Settings',
              href: `/${cloudSlug}/${teamSlug}/settings`,
              error: !teamHasDefaultPaymentMethod(team) && team?.hasPublishedProjects,
              subpaths: [
                `/${cloudSlug}/${teamSlug}/settings/members`,
                `/${cloudSlug}/${teamSlug}/settings/subscriptions`,
                `/${cloudSlug}/${teamSlug}/settings/billing`,
                `/${cloudSlug}/${teamSlug}/settings/invoices`,
              ],
            },
          }}
        />
      </Gutter>
      {children}
    </>
  )
}
