'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'
import { useHeaderTheme } from '@providers/HeaderTheme'
import { ThemeProvider } from '@providers/Theme'
import { MainMenu } from '@root/payload-types'
import { useScrollInfo } from '@faceless-ui/scroll-info'
import { MobileNav, modalSlug as mobileNavModalSlug } from './MobileNav'
import { DesktopNav } from './DesktopNav'

import classes from './index.module.scss'

export const Header: React.FC<MainMenu> = ({ navItems }) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(mobileNavModalSlug)
  const { headerColor } = useHeaderTheme()
  const { y } = useScrollInfo()
  const [hideBackground, setHideBackground] = React.useState(true)

  React.useEffect(() => {
    setHideBackground(y < 30)
  }, [y])

  return (
    <ThemeProvider theme={headerColor}>
      <header
        className={[
          classes.header,
          hideBackground && classes.hideBackground,
          isMobileNavOpen && classes.mobileNavOpen,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <DesktopNav navItems={navItems} />
        <MobileNav navItems={navItems} />
      </header>
    </ThemeProvider>
  )
}
