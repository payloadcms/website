'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { useSearchParams } from 'next/navigation'

import { UniversalTruth } from '@components/UniversalTruth/index.js'
import { MainMenu } from '@root/payload-types.js'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver/index.js'
import { DesktopNav } from './DesktopNav/index.js'
import { MobileNav, modalSlug as mobileNavModalSlug } from './MobileNav/index.js'

import classes from './index.module.scss'

export const Header: React.FC<MainMenu> = ({ tabs }) => {
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
  }, [y, isMobileNavOpen])

  return (
    <div data-theme={headerTheme}>
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
        <DesktopNav tabs={tabs} hideBackground={hideBackground} />
        <MobileNav tabs={tabs} />
        <React.Suspense>
          <UniversalTruth />
        </React.Suspense>
      </header>
    </div>
  )
}
