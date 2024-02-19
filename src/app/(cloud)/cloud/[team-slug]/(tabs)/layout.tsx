import { fetchTeamWithCustomer } from '@root/app/(cloud)/cloud/_api/fetchTeam'
import { DashboardTabs } from '@root/app/(cloud)/cloud/_components/DashboardTabs'
import { teamHasDefaultPaymentMethod } from '@root/app/(cloud)/cloud/_utilities/teamHasDefaultPaymentMethod'
import { cloudSlug } from '@root/app/(cloud)/cloud/slug'

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
      {children}
    </>
  )
}
