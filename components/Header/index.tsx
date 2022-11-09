'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'
import { MainMenu } from '../../payload-types'
import { MobileNav, modalSlug as mobileNavModalSlug } from './MobileNav'
import { DesktopNav } from './DesktopNav'
import { useHeaderTheme } from '../providers/HeaderTheme'
import { ThemeProvider } from '../providers/Theme'

import classes from './index.module.scss'

export const Header: React.FC<MainMenu> = ({ navItems }) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(mobileNavModalSlug)
  const { headerColor } = useHeaderTheme()
  console.log(headerColor)
  return (
    <ThemeProvider theme={headerColor}>
      <header
        className={[classes.header, isMobileNavOpen && classes.mobileNavOpen]
          .filter(Boolean)
          .join(' ')}
      >
        <DesktopNav navItems={navItems} />
        <MobileNav navItems={navItems} />
      </header>
    </ThemeProvider>
  )
}
