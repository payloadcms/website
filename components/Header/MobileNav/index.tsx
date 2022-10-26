import { Cell, Grid } from '@faceless-ui/css-grid'
import { MainMenu } from '../../../payload-types'
import { FullLogo } from '../../graphics/FullLogo'
import { Gutter } from '../../Gutter'
import { Modal, ModalToggler } from '@faceless-ui/modal'
import { SearchIcon } from '../../graphics/SearchIcon'
import { MenuIcon } from '../../graphics/MenuIcon'
import { Button } from '../../Button'
import { CMSLink } from '../../CMSLink'

import classes from './index.module.scss'

const modalSlug = 'mobile-nav'

type NavItems = Pick<MainMenu, 'navItems'>
export const MobileNav: React.FC<NavItems> = props => {
  return (
    <div className={classes.mobileNav}>
      <MenuBar />
      <MobileMenuModal {...props} />
    </div>
  )
}

const MenuBar: React.FC = () => {
  return (
    <div className={classes.menuBar}>
      <Gutter>
        <Grid>
          <Cell className={classes.menuBarContainer}>
            <div className={classes.logo}>
              <FullLogo />
            </div>

            <div className={classes.icons}>
              <Button className={classes.searchToggler}>
                <SearchIcon />
              </Button>

              <ModalToggler slug={modalSlug} className={classes.modalToggler}>
                <MenuIcon />
              </ModalToggler>
            </div>
          </Cell>
        </Grid>
      </Gutter>
    </div>
  )
}

const MobileMenuModal: React.FC<NavItems> = ({ navItems }) => {
  return (
    <Modal slug={modalSlug} className={classes.mobileMenuModal}>
      <MenuBar />

      <Gutter>
        <Grid>
          <Cell>
            <div className={classes.mobileMenu}>
              <div className={classes.mobileMenuItems}>
                {(navItems || []).map((item, index) => {
                  return <CMSLink className={classes.mobileMenuItem} key={index} {...item.link} />
                })}
              </div>
            </div>
          </Cell>
        </Grid>
      </Gutter>
      <div className={classes.blur} />
    </Modal>
  )
}
