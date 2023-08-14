'use client'

import { usePathname } from 'next/navigation'

import { Tabs } from '../Tabs'

export const cloudSlug = 'cloud'

export type Tabs = {
  [key: string]: {
    label?: string
    href?: string
    subpaths?: string[]
  }
}

export const DashboardTabs: React.FC<{
  tabs: Tabs
}> = ({ tabs }) => {
  const pathname = usePathname()

  const formattedTabs = Object.entries(tabs).reduce((acc: any[], [, tab]) => {
    if (tab.label) {
      const onTabPath = pathname && (pathname === tab.href || tab?.subpaths?.includes(pathname))

      acc.push({
        label: tab.label,
        url: tab.href,
        isActive: onTabPath,
      })
    }

    return acc
  }, [])

  return <Tabs tabs={formattedTabs} />
}
