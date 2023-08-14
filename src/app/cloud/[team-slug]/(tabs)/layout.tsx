import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam'
import { DashboardTabs } from '@cloud/_components/DashboardTabs'
import { cloudSlug } from '@cloud/slug'

export default async props => {
  const {
    children,
    params: { 'team-slug': teamSlug },
  } = props

  // Note: this fetch will get deduped by the page
  // each page within this layout calls this same function
  // Next.js will only call it once
  const team = await fetchTeamWithCustomer(teamSlug)

  // display an error to the user if the team has no default payment method
  const defaultPaymentMethod = team?.stripeCustomer?.invoice_settings?.default_payment_method

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
            error: !defaultPaymentMethod,
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
