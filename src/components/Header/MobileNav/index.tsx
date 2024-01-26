import * as React from 'react'
import { Modal, useModal } from '@faceless-ui/modal'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Avatar } from '@components/Avatar'
import { Gutter } from '@components/Gutter'
import { DiscordIcon } from '@root/graphics/DiscordIcon'
import { ChevronIcon } from '@root/icons/ChevronIcon'
import { MainMenu } from '@root/payload-types'
import { useAuth } from '@root/providers/Auth'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver'
import { useThemePreference } from '@root/providers/Theme'
import { Theme } from '@root/providers/Theme/types'
import { FullLogo } from '../../../graphics/FullLogo'
import { MenuIcon } from '../../../graphics/MenuIcon'
import { CMSLink } from '../../CMSLink'
import { DocSearch } from '../Docsearch'

import classes from './index.module.scss'

export const modalSlug = 'mobile-nav'
export const subMenuSlug = 'mobile-sub-menu'

type NavItems = Pick<MainMenu, 'tabs'>

const MobileNavItems = ({ tabs, setActiveTab }) => {
  const { user } = useAuth()
  const { openModal } = useModal()

  const handleOnClick = index => {
    openModal(subMenuSlug)
    setActiveTab(index)
  }

  return (
    <ul className={classes.mobileMenuItems}>
      {(tabs || []).map((tab, index) => {
        return (
          <div key={index}>
            <button
              className={classes.mobileMenuItem}
              key={index}
              onClick={() => handleOnClick(index)}
            >
              {tab.label}
            </button>
          </div>
        )
      })}

      <Link
        className={[classes.newProject, classes.mobileMenuItem].filter(Boolean).join(' ')}
        href="/new"
        prefetch={false}
      >
        New project
      </Link>
      {!user && (
        <Link className={classes.mobileMenuItem} href="/login" prefetch={false}>
          Login
        </Link>
      )}
      <a
        className={[classes.discord, classes.mobileMenuItem].filter(Boolean).join(' ')}
        href="https://discord.com/invite/r6sCXqVk3v"
        target="_blank"
        rel="noreferrer"
      >
        <DiscordIcon />
      </a>
    </ul>
  )
}

const MobileMenuModal: React.FC<
  NavItems & {
    setActiveTab: (index: number) => void
  }
> = ({ tabs, setActiveTab }) => {
  return (
    <Modal slug={modalSlug} className={classes.mobileMenuModal} trapFocus={false}>
      <Gutter>
        <div className={classes.mobileMenu}>
          <MobileNavItems tabs={tabs} setActiveTab={setActiveTab} />
        </div>
      </Gutter>
      <div className={classes.modalBlur} />
    </Modal>
  )
}

const SubMenuModal: React.FC<
  NavItems & {
    activeTab: number | undefined
  }
> = ({ tabs, activeTab }) => {
  const { closeModal } = useModal()

  return (
    <Modal slug={subMenuSlug} className={classes.mobileMenuModal} trapFocus={false}>
      <Gutter className={classes.mobileSubMenu}>
        {(tabs || []).map((tab, index) => {
          if (index !== activeTab) return null

          return (
            <div key={index}>
              <div className={classes.subMenuHeader}>
                <button className={classes.backButton} onClick={() => closeModal(subMenuSlug)}>
                  <ChevronIcon rotation={180} />
                  Back
                </button>
                <span className={classes.mobileMenuItem}>{tab.label}</span>
              </div>

              <div className={classes.subMenuItems}>
                {(tab.navItems || []).map((item, index) => {
                  return <CMSLink key={index} {...item.link} className={classes.subMenuItem} />
                })}
              </div>
            </div>
          )
        })}
      </Gutter>
      <div className={classes.modalBlur} />
    </Modal>
  )
}

export const MobileNav: React.FC<NavItems> = props => {
  const { isModalOpen, openModal, closeModal, closeAllModals } = useModal()
  const { headerTheme, setHeaderTheme } = useHeaderObserver()
  const { theme } = useThemePreference()
  const themeBeforeOpenRef = React.useRef<Theme | null | undefined>(theme)
  const { user } = useAuth()
  const pathname = usePathname()
  const [activeTab, setActiveTab] = React.useState<number | undefined>()

  const isMenuOpen = isModalOpen(modalSlug)

  React.useEffect(() => {
    closeAllModals()
  }, [pathname, closeAllModals])

  const toggleModal = React.useCallback(() => {
    if (isMenuOpen) {
      closeAllModals()
      setHeaderTheme(themeBeforeOpenRef?.current || theme)
    } else {
      themeBeforeOpenRef.current = headerTheme
      setHeaderTheme('dark')
      openModal(modalSlug)
    }
  }, [isMenuOpen, closeAllModals, openModal, setHeaderTheme, headerTheme, theme])

  return (
    <div className={classes.mobileNav}>
      <div className={classes.menuBar}>
        <Gutter>
          <div className={'grid'}>
            <div className={[classes.menuBarContainer, 'cols-16'].filter(Boolean).join(' ')}>
              <Link
                href="/"
                className={classes.logo}
                prefetch={false}
                aria-label="Full Payload Logo"
              >
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
                <button
                  type="button"
                  className={[classes.modalToggler, isMenuOpen ? classes.open : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={toggleModal}
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  <MenuIcon />
                </button>
              </div>
            </div>
          </div>
        </Gutter>
      </div>
      <MobileMenuModal {...props} setActiveTab={setActiveTab} />
      <SubMenuModal {...props} activeTab={activeTab} />
    </div>
  )
}
