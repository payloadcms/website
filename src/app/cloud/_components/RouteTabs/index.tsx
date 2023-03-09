'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'

import classes from './index.module.scss'

export type TabRoute = {
  label: string
  url?: string
}

export const RouteTabs: React.FC<{
  tabs?: TabRoute[]
  className?: string
}> = props => {
  const { tabs, className } = props
  const pathname = usePathname()

  return (
    <div className={[classes.tabsContainer, className].filter(Boolean).join(' ')}>
      <Gutter>
        <div className={classes.tabs}>
          {tabs?.map(({ url: tabURL, label }, index) => {
            const isActive = pathname === tabURL

            return (
              <Heading
                key={index}
                className={[classes.tab, isActive && classes.active].filter(Boolean).join(' ')}
                href={tabURL}
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
