import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Modal, useModal } from '@faceless-ui/modal'
import Link from 'next/link'
import { useHeaderTheme } from '@components/providers/HeaderTheme'
import { MainMenu } from '../../../payload-types'
import { FullLogo } from '../../graphics/FullLogo'
import { Gutter } from '../../Gutter'
import { SearchIcon } from '../../graphics/SearchIcon'
import { MenuIcon } from '../../graphics/MenuIcon'
import { CMSLink } from '../../CMSLink'

import classes from './index.module.scss'

export const modalSlug = 'mobile-nav'

type NavItems = Pick<MainMenu, 'navItems'>

const MobileNavItems = ({ navItems }: NavItems) => {
  return (
    <ul className={classes.mobileMenuItems}>
      {(navItems || []).map((item, index) => {
        return <CMSLink className={classes.mobileMenuItem} key={index} {...item.link} />
      })}
    </ul>
  )
}

const MobileMenuModal: React.FC<NavItems> = ({ navItems }) => {
  return (
    <Modal slug={modalSlug} className={classes.mobileMenuModal}>
      <Gutter>
        <Grid>
          <Cell>
            <div className={classes.mobileMenu}>
              <MobileNavItems navItems={navItems} />
            </div>
          </Cell>
        </Grid>
      </Gutter>
      <div className={classes.modalBlur} />
    </Modal>
  )
}

export const MobileNav: React.FC<NavItems> = props => {
  const { isModalOpen, openModal, closeModal } = useModal()
  const { headerColor, setHeaderColor } = useHeaderTheme()
  const headerColorRef = React.useRef(null)

  function toggleModal() {
    if (isModalOpen(modalSlug)) {
      closeModal(modalSlug)
      setHeaderColor(headerColorRef.current)
      // headerColorRef.current = headerColor
    } else {
      headerColorRef.current = headerColor
      setHeaderColor('dark')
      openModal(modalSlug)
    }
  }

  return (
    <div className={classes.mobileNav}>
      <div className={classes.menuBar}>
        <Gutter>
          <Grid>
            <Cell className={classes.menuBarContainer}>
              <Link href="/" className={classes.logo}>
                <FullLogo />
              </Link>

              <div className={classes.icons}>
                <button type="button" className={classes.searchToggler}>
                  <SearchIcon />
                </button>

                <button type="button" className={classes.modalToggler} onClick={toggleModal}>
                  <MenuIcon />
                </button>
              </div>
            </Cell>
          </Grid>
        </Gutter>
      </div>

      <MobileMenuModal {...props} />
    </div>
  )
}
