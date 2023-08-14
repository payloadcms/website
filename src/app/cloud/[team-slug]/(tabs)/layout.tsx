import { DashboardTabs } from '@cloud/_components/DashboardTabs'
import { cloudSlug } from '@cloud/slug'

export default props => {
  const {
    children,
    params: { 'team-slug': teamSlug },
  } = props

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
