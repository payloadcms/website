'use client'

import { usePathname } from 'next/navigation'

import { Tab, Tabs } from '../Tabs/index.js'

export const cloudSlug = 'cloud'

export type TabsType = {
  [key: string]: {
    label?: string
    href?: string
    subpaths?: string[]
    error?: boolean
    disabled?: boolean
    warning?: boolean
  }
}

export const DashboardTabs: React.FC<{
  tabs: TabsType
}> = ({ tabs }) => {
  const pathname = usePathname()

  const formattedTabs = Object.entries(tabs).reduce((acc: Tab[], [, tab]) => {
    if (tab.label) {
      const onTabPath = Boolean(
        pathname && (pathname === tab.href || tab?.subpaths?.includes(pathname)),
      )

      acc.push({
        label: tab.label,
        url: tab.href,
        isActive: onTabPath,
        error: tab.error,
        disabled: tab.disabled,
        warning: tab.warning,
      })
    }

    return acc
  }, [])

  return <Tabs tabs={formattedTabs} />
}
