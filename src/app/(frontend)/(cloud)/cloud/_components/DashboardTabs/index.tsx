'use client'

import { usePathname } from 'next/navigation'

import type { Tab } from '../Tabs/index'

import { Tabs } from '../Tabs/index'

export const cloudSlug = 'cloud'

export type TabsType = {
  [key: string]: {
    disabled?: boolean
    error?: boolean
    href?: string
    label?: string
    subpaths?: string[]
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
        disabled: tab.disabled,
        error: tab.error,
        isActive: onTabPath,
        label: tab.label,
        url: tab.href,
        warning: tab.warning,
      })
    }

    return acc
  }, [])

  return <Tabs tabs={formattedTabs} />
}
