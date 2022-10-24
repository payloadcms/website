import { OuterGutter } from '../../elements/OuterGutter'
import { MobileNav } from './MobileNav'
import { Nav } from './Nav'

export const Header: React.FC = () => {
  return (
    <OuterGutter>
      <Nav />
      <MobileNav />
    </OuterGutter>
  )
}
