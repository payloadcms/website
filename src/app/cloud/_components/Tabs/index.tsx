import * as React from 'react'

import { EdgeScroll } from '@components/EdgeScroll'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'

import classes from './index.module.scss'

export type Tab = {
  label: string | React.ReactNode
  isActive?: boolean
} & (
  | {
      url: string
      onClick?: never
    }
  | {
      url?: never
      onClick: () => void
    }
)

export const Tabs: React.FC<{
  tabs?: Tab[]
  className?: string
}> = props => {
  const { tabs, className } = props

  return (
    <div className={[classes.tabsContainer, className].filter(Boolean).join(' ')}>
      <Gutter>
        <EdgeScroll className={classes.tabs}>
          {tabs?.map(({ url: tabURL, onClick, label, isActive }, index) => {
            const RenderTab = (
              <Heading
                key={index}
                className={[
                  classes.tab,
                  isActive && classes.active,
                  index === tabs.length - 1 && classes.lastTab,
                ]
                  .filter(Boolean)
                  .join(' ')}
                href={tabURL}
                element="h5"
              >
                {label}
              </Heading>
            )

            if (onClick) {
              return (
                <button key={index} onClick={onClick} type="button" className={classes.buttonTab}>
                  {RenderTab}
                </button>
              )
            }

            return RenderTab
          })}
        </EdgeScroll>
      </Gutter>
    </div>
  )
}
