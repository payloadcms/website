import { DashboardTabs } from '@root/app/(cloud)/cloud/_components/DashboardTabs'
import { cloudSlug } from '@root/app/(cloud)/cloud/slug'

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
