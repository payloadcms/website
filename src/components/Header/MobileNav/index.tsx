import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Modal, useModal } from '@faceless-ui/modal'
import { HeaderColors, useHeaderTheme } from '@providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Avatar } from '@components/Avatar'
import { Gutter } from '@components/Gutter'
import { MainMenu } from '@root/payload-types'
import { useAuth } from '@root/providers/Auth'
import { DiscordIcon } from '../../../graphics/DiscordIcon'
import { FullLogo } from '../../../graphics/FullLogo'
import { MenuIcon } from '../../../graphics/MenuIcon'
import { CMSLink } from '../../CMSLink'
import { DocSearch } from '../Docsearch'

import classes from './index.module.scss'

export const modalSlug = 'mobile-nav'

type NavItems = Pick<MainMenu, 'navItems'>

const MobileNavItems = ({ navItems }: NavItems) => {
  const { user } = useAuth()

  return (
    <ul className={classes.mobileMenuItems}>
      {(navItems || []).map((item, index) => {
        return <CMSLink className={classes.mobileMenuItem} key={index} {...item.link} />
      })}
      <Link className={classes.mobileMenuItem} href="/new" prefetch={false}>
        New project
      </Link>
      {!user && (
        <Link className={classes.mobileMenuItem} href="/login" prefetch={false}>
          Login
        </Link>
      )}
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
  const { isModalOpen, openModal, closeModal, closeAllModals } = useModal()
  const { headerColor, setHeaderColor } = useHeaderTheme()
  const headerColorRef = React.useRef<HeaderColors | null | undefined>(undefined)
  const { user } = useAuth()

  const pathname = usePathname()

  React.useEffect(() => {
    closeAllModals()
  }, [pathname, closeAllModals])

  function toggleModal() {
    if (isModalOpen(modalSlug)) {
      closeModal(modalSlug)
      setHeaderColor(headerColorRef.current)
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
              <Link href="/" className={classes.logo} prefetch={false}>
                <FullLogo />
              </Link>

              <div className={classes.icons}>
                <div className={classes.cloudNewProject}>
                  <Link href="/new" prefetch={false}>
                    New project
                  </Link>
                  {!user && (
                    <Link href="/login" prefetch={false}>
                      Login
                    </Link>
                  )}
                </div>
                {user && <Avatar className={classes.mobileAvatar} />}
                <DocSearch />
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
