'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'
import { useScrollInfo } from '@faceless-ui/scroll-info'

import { MainMenu } from '@root/payload-types'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver'
import { DesktopNav } from './DesktopNav'
import { MobileNav, modalSlug as mobileNavModalSlug } from './MobileNav'

import classes from './index.module.scss'

export const Header: React.FC<MainMenu> = ({ navItems }) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(mobileNavModalSlug)
  const { headerTheme } = useHeaderObserver()
  const { y } = useScrollInfo()
  const [hideBackground, setHideBackground] = React.useState(false)

  React.useEffect(() => {
    if (isMobileNavOpen) {
      setHideBackground(false)
    } else {
      setHideBackground(y < 30)
    }
  }, [y, isMobileNavOpen])

  return (
    <div data-theme={headerTheme}>
      <header
        className={[
          classes.header,
          hideBackground && classes.hideBackground,
          isMobileNavOpen && classes.mobileNavOpen,
          headerTheme && classes.hasTheme,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <DesktopNav navItems={navItems} />
        <MobileNav navItems={navItems} />
      </header>
    </div>
  )
}
