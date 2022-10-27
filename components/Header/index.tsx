import * as React from 'react'
import { MainMenu } from '../../payload-types'
import { MobileNav } from './MobileNav'
import { DesktopNav } from './DesktopNav'

export const Header: React.FC<MainMenu> = ({ navItems }) => {
  return (
    <header>
      <DesktopNav navItems={navItems} />
      <MobileNav navItems={navItems} />
    </header>
  )
}
