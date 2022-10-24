import { MainMenu } from '../../../payload-types'
import { OuterGutter } from '../OuterGutter'
import { MobileNav } from './MobileNav'
import { Nav } from './Nav'

export const Header: React.FC<MainMenu> = ({ navItems }) => {
  return (
    <header>
      <OuterGutter>
        <Nav navItems={navItems} />
        <MobileNav navItems={navItems} />
      </OuterGutter>
    </header>
  )
}
