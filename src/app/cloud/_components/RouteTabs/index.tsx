import * as React from 'react'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'

import classes from './index.module.scss'

export type TabRoute = {
  label: string
  url?: string
  isActive?: boolean
}

export const RouteTabs: React.FC<{
  tabs?: TabRoute[]
  className?: string
}> = props => {
  const { tabs, className } = props

  return (
    <div className={[classes.tabsContainer, className].filter(Boolean).join(' ')}>
      <Gutter>
        <div className={classes.tabs}>
          {tabs?.map(({ url: tabURL, label, isActive }, index) => {
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
