import * as React from 'react'
import { useModal } from '@faceless-ui/modal'
import { MainMenu } from '../../payload-types'
import { MobileNav, modalSlug as mobileNavModalSlug } from './MobileNav'
import { DesktopNav } from './DesktopNav'

import classes from './index.module.scss'
import { useHeaderTheme } from '../providers/HeaderTheme'
import { ThemeProvider } from '../providers/Theme'

export const Header: React.FC<MainMenu> = ({ navItems }) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(mobileNavModalSlug)
  const { headerColor } = useHeaderTheme()

  return (
    <ThemeProvider theme={headerColor === 'light' ? 'dark' : 'light'}>
      <header
        className={[
          classes.header,
          isMobileNavOpen && classes.mobileNavOpen,
          classes[`headerColor--${headerColor}`],
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
