'use client'

import type { MainMenu, TopBar as TopBarType } from '@root/payload-types'

import { TopBar } from '@components/TopBar'
import { UniversalTruth } from '@components/UniversalTruth/index'
import { useModal } from '@faceless-ui/modal'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver/index'
import * as React from 'react'

import { DesktopNav } from './DesktopNav/index'
import classes from './index.module.scss'
import { MobileNav, modalSlug as mobileNavModalSlug } from './MobileNav/index'

export const Header: React.FC<
  {
    topBar?: TopBarType
  } & MainMenu
> = ({ menuCta, tabs, topBar }) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(mobileNavModalSlug)
  const { headerTheme } = useHeaderObserver()
  const { y } = useScrollInfo()
  const [hideBackground, setHideBackground] = React.useState(true)

  React.useEffect(() => {
    if (!topBar?.enableTopBar) {
      setHideBackground(false)
      document.documentElement.style.setProperty('--top-bar-height', '0px')
    } else {
      document.documentElement.style.setProperty('--top-bar-height', y > 30 ? '0px' : '3rem')
    }
  }, [topBar?.enableTopBar, y])

  React.useEffect(() => {
    if (isMobileNavOpen) {
      setHideBackground(false)
    } else {
      setHideBackground(y < 30)
    }
  }, [y, isMobileNavOpen])

  return (
    <div className={classes.wrapper} data-theme={headerTheme}>
      {topBar?.enableTopBar && (
        <div className={classes.topBar} id="topBar">
          <TopBar {...topBar} />
        </div>
      )}
      <header
        className={[
          classes.header,
          hideBackground && classes.hideBackground,
          isMobileNavOpen && classes.mobileNavOpen,
          headerTheme && classes.themeIsSet,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <DesktopNav hideBackground={hideBackground} menuCta={menuCta} tabs={tabs} />
        <MobileNav menuCta={menuCta} tabs={tabs} />
        <React.Suspense>
          <UniversalTruth />
        </React.Suspense>
      </header>
    </div>
  )
}
