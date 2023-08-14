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
            label: 'All Projects',
          },
          teams: {
            label: 'Teams',
            href: `/${cloudSlug}/teams`,
          },
          settings: {
            label: 'Account',
            href: `/${cloudSlug}/settings`,
          },
        }}
      />
      {children}
    </>
  )
}
