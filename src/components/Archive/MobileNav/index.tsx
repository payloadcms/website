'use client'

import { ChevronDownIcon } from '@icons/ChevronDownIcon'
import * as Accordion from '@radix-ui/react-accordion'

import classes from '../index.module.scss'

export const MobileNav = ({
  children,
  className,
  currentCategory,
}: {
  children: React.ReactNode
  className: string
  currentCategory: string
}) => {
  return (
    <Accordion.Root className={className} collapsible type="single">
      <Accordion.Item value="menu">
        <Accordion.Trigger asChild>
          <div className={classes.mobileNavTrigger}>
            <span>
              Posts <span className={classes.divider}>/</span> {currentCategory}
            </span>{' '}
            <ChevronDownIcon className={classes.chevron} />
          </div>
        </Accordion.Trigger>
        <Accordion.Content>{children}</Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  )
}
