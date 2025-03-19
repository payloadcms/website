import { EdgeScroll } from '@components/EdgeScroll/index'
import { Gutter } from '@components/Gutter/index'
import { Heading } from '@components/Heading/index'
import { ErrorIcon } from '@root/icons/ErrorIcon/index'
import Link from 'next/link'
import * as React from 'react'

import classes from './index.module.scss'

export type Tab = {
  disabled?: boolean
  error?: boolean
  isActive?: boolean
  label: React.ReactNode | string
  onClick?: () => void
  url?: string
  warning?: boolean
}

const TabContents: React.FC<Tab> = (props) => {
  const { error, label, warning } = props

  return (
    <React.Fragment>
      {label}
      {error && (
        <div className={[classes.iconWrapper, classes.error].filter(Boolean).join(' ')}>
          <ErrorIcon className={classes.icon} size="medium" />
        </div>
      )}
      {!error && warning && (
        <div className={[classes.iconWrapper, classes.warning].filter(Boolean).join(' ')}>
          <ErrorIcon className={classes.icon} size="medium" />
        </div>
      )}
    </React.Fragment>
  )
}

export const Tabs: React.FC<{
  className?: string
  tabs?: Tab[]
}> = (props) => {
  const { className, tabs } = props

  return (
    <div className={[classes.tabsContainer, className].filter(Boolean).join(' ')}>
      <EdgeScroll className={classes.tabs}>
        {tabs?.map((tab, index) => {
          const { disabled, error, isActive, onClick, url: tabURL, warning } = tab

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
                className={classList}
                disabled={disabled}
                key={index}
                onClick={onClick}
                type="button"
              >
                <TabContents {...tab} />
              </button>
            )
          }

          const RenderTab = (
            <Link className={classList} href={tabURL || ''} key={index}>
              <TabContents {...tab} />
            </Link>
          )

          return RenderTab
        })}
      </EdgeScroll>
    </div>
  )
}
