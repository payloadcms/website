'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'

import classes from './index.module.scss'

type TabRoute = {
  label: string
  slug?: string
}

export const RouteTabs: React.FC<{
  tabs: TabRoute[]
  basePath?: string
  className?: string
}> = props => {
  const { tabs, basePath, className } = props
  const pathname = usePathname()
  const slug = pathname?.split('/').pop()

  return (
    <div className={[classes.tabsContainer, className].filter(Boolean).join(' ')}>
      <Gutter>
        <div className={classes.tabs}>
          {tabs.map(({ slug: tabSlug, label }, index) => {
            const isActive = tabSlug ? tabSlug === slug : basePath === pathname

            const href = basePath ? `${basePath}${tabSlug ? `/${tabSlug}` : ''}` : `/${tabSlug}`

            return (
              <Heading
                key={index}
                className={[classes.tab, isActive && classes.active].filter(Boolean).join(' ')}
                href={href}
                element="h5"
              >
                {label}
              </Heading>
            )
          })}
        </div>
      </Gutter>
    </div>
  )
}
