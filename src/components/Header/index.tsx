'use client'

import type { MainMenu } from '@root/payload-types'

import { UniversalTruth } from '@components/UniversalTruth/index'
import { useModal } from '@faceless-ui/modal'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver/index'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'

import { DesktopNav } from './DesktopNav/index'
import classes from './index.module.scss'
import { MobileNav, modalSlug as mobileNavModalSlug } from './MobileNav/index'

export const Header: React.FC<
  {
    children?: React.ReactNode
  } & MainMenu
> = ({ children, menuCta, tabs }) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(mobileNavModalSlug)
  const { headerTheme } = useHeaderObserver()
  const { y } = useScrollInfo()
  const [hideBackground, setHideBackground] = React.useState(true)

  React.useEffect(() => {
    if (isMobileNavOpen) {
      setHideBackground(false)
    } else {
      setHideBackground(y < 30)
    }
    document.documentElement.style.setProperty('--top-bar-height', y > 30 ? '0px' : '3rem')
  }, [y, isMobileNavOpen])

  return (
    <div className={classes.wrapper} data-theme={headerTheme}>
      <div className={classes.topBar} id="topBar">
        {children}
      </div>
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
