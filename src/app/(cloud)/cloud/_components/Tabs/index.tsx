import * as React from 'react'
import Link from 'next/link'

import { EdgeScroll } from '@components/EdgeScroll/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Heading } from '@components/Heading/index.js'
import { ErrorIcon } from '@root/icons/ErrorIcon/index.js'

import classes from './index.module.scss'

export type Tab = {
  label: string | React.ReactNode
  isActive?: boolean
  error?: boolean
  warning?: boolean
  url?: string
  onClick?: () => void
  disabled?: boolean
}

const TabContents: React.FC<Tab> = props => {
  const { label, error, warning } = props

  return (
    <React.Fragment>
      {label}
      {error && (
        <div className={[classes.iconWrapper, classes.error].filter(Boolean).join(' ')}>
          <ErrorIcon size="medium" className={classes.icon} />
        </div>
      )}
      {!error && warning && (
        <div className={[classes.iconWrapper, classes.warning].filter(Boolean).join(' ')}>
          <ErrorIcon size="medium" className={classes.icon} />
        </div>
      )}
    </React.Fragment>
  )
}

export const Tabs: React.FC<{
  tabs?: Tab[]
  className?: string
}> = props => {
  const { tabs, className } = props

  return (
    <div className={[classes.tabsContainer, className].filter(Boolean).join(' ')}>
      <EdgeScroll className={classes.tabs}>
        {tabs?.map((tab, index) => {
          const { url: tabURL, onClick, isActive, error, disabled, warning } = tab

          const classList = [
            classes.tab,
            isActive && classes.active,
            error && classes.error,
            warning && classes.warning,
            disabled && classes.disabled,
            index === tabs.length - 1 && classes.lastTab,
          ]
            .filter(Boolean)
            .join(' ')

          if (onClick || disabled) {
            return (
              <button
                key={index}
                onClick={onClick}
                type="button"
                className={classList}
                disabled={disabled}
              >
                <TabContents {...tab} />
              </button>
            )
          }

          const RenderTab = (
            <Link key={index} href={tabURL || ''} className={classList}>
              <TabContents {...tab} />
            </Link>
          )

          return RenderTab
        })}
      </EdgeScroll>
    </div>
  )
}
