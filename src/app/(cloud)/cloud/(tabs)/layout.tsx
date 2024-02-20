import { DashboardTabs } from '@cloud/_components/DashboardTabs'
import { cloudSlug } from '@cloud/slug'

export default async props => {
  const { children } = props

  return (
    <>
      <DashboardTabs
        tabs={{
          [cloudSlug]: {
            href: `/${cloudSlug}`,
            label: 'Projects',
          },
          teams: {
            label: 'Teams',
            href: `/${cloudSlug}/teams`,
          },
          settings: {
            label: 'Settings',
            href: `/${cloudSlug}/settings`,
          },
        }}
      />
      {children}
    </>
  )
}
