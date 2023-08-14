import * as React from 'react'
import Link from 'next/link'

import { EdgeScroll } from '@components/EdgeScroll'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { ErrorIcon } from '@root/icons/ErrorIcon'

import classes from './index.module.scss'

export type Tab = {
  label: string | React.ReactNode
  isActive?: boolean
  error?: boolean
  url?: string
  onClick?: never
}

export const Tabs: React.FC<{
  tabs?: Tab[]
  className?: string
}> = props => {
  const { tabs, className } = props

  return (
    <div className={[classes.tabsContainer, className].filter(Boolean).join(' ')}>
      <Gutter>
        <EdgeScroll className={classes.tabs}>
          {tabs?.map((tab, index) => {
            const { label, url: tabURL, onClick, isActive, error } = tab

            const RenderTab = (
              <Link
                key={index}
                href={tabURL || ''}
                className={[
                  classes.tab,
                  isActive && classes.active,
                  error && classes.error,
                  index === tabs.length - 1 && classes.lastTab,
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Heading element="h5" margin={false}>
                  {label}
                </Heading>
                {error && (
                  <div className={classes.errorIconWrapper}>
                    <ErrorIcon size="medium" className={classes.errorIcon} />
                  </div>
                )}
              </Link>
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
