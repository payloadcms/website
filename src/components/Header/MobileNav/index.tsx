import * as React from 'react'
import { Modal, useModal } from '@faceless-ui/modal'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Avatar } from '@components/Avatar'
import { BackgroundGrid } from '@components/BackgroundGrid'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { CrosshairIcon } from '@root/icons/CrosshairIcon'
import { MainMenu } from '@root/payload-types'
import { useAuth } from '@root/providers/Auth'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver'
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
        if (tab.enableDirectLink)
          return (
            <CMSLink key={index} className={classes.mobileMenuItem} {...tab.link} label={tab.label}>
              <ArrowIcon size="medium" rotation={45} />
            </CMSLink>
          )
        return (
          <button
            className={classes.mobileMenuItem}
            key={index}
            onClick={() => handleOnClick(index)}
          >
            {tab.label}
            <ArrowIcon size="medium" rotation={45} />
          </button>
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
      <CrosshairIcon
        className={[classes.crosshair, classes.crosshairTopLeft].filter(Boolean).join(' ')}
        size="large"
      />
      <CrosshairIcon
        className={[classes.crosshair, classes.crosshairBottomLeft].filter(Boolean).join(' ')}
        size="large"
      />
    </ul>
  )
}

const MobileMenuModal: React.FC<
  NavItems & {
    setActiveTab: (index: number) => void
    theme?: Theme | null
  }
> = ({ tabs, setActiveTab, theme }) => {
  return (
    <Modal slug={modalSlug} className={classes.mobileMenuModal} trapFocus={false}>
      <div data-theme={theme} style={{ height: '100%' }}>
        <Gutter className={classes.mobileMenuWrap} rightGutter={false}>
          <div className={classes.mobileMenu}>
            <MobileNavItems tabs={tabs} setActiveTab={setActiveTab} />
          </div>
          <BackgroundGrid zIndex={0} />
          <BackgroundScanline />
          <div className={classes.modalBlur} />
        </Gutter>
      </div>
    </Modal>
  )
}

const SubMenuModal: React.FC<
  NavItems & {
    activeTab: number | undefined
    theme?: Theme | null
  }
> = ({ tabs, activeTab, theme }) => {
  const { closeModal } = useModal()
  return (
    <Modal
      slug={subMenuSlug}
      className={[classes.mobileMenuModal, classes.mobileSubMenu].join(' ')}
      trapFocus={false}
    >
      <div data-theme={theme} style={{ height: '100%' }}>
        <Gutter className={classes.subMenuWrap}>
          {(tabs || []).map((tab, tabIndex) => {
            if (tabIndex !== activeTab) return null
            return (
              <div className={classes.subMenuItems}>
                <button className={classes.backButton} onClick={() => closeModal(subMenuSlug)}>
                  <ArrowIcon size="medium" rotation={225} />
                  Back
                  <CrosshairIcon
                    className={[classes.crosshair, classes.crosshairTopLeft]
                      .filter(Boolean)
                      .join(' ')}
                    size="large"
                  />
                </button>
                {(tab.navItems || []).map((item, index) => {
                  return (
                    <div className={classes.linkWrap} key={index}>
                      {item.style === 'default' && item.defaultLink && (
                        <CMSLink
                          className={classes.defaultLink}
                          {...item.defaultLink.link}
                          label=""
                        >
                          <div className={classes.listLabelWrap}>
                            <div className={classes.listLabel}>
                              {item.defaultLink.link.label}
                              <ArrowIcon size="medium" rotation={0} />
                            </div>
                            <div className={classes.itemDescription}>
                              {item.defaultLink.description}
                            </div>
                          </div>
                        </CMSLink>
                      )}
                      {item.style === 'list' && item.listLinks && (
                        <div className={classes.linkList}>
                          <div className={classes.tag}>{item.listLinks.tag}</div>
                          <div className={classes.listWrap}>
                            {item.listLinks.links &&
                              item.listLinks.links.map((link, linkIndex) => (
                                <CMSLink className={classes.link} key={linkIndex} {...link.link} />
                              ))}
                          </div>
                        </div>
                      )}
                      {item.style === 'featured' && item.featuredLink && (
                        <div className={classes.featuredLink}>
                          <div className={classes.tag}>{item.featuredLink.tag}</div>
                          {item.featuredLink?.label && (
                            <RichText
                              className={classes.featuredLinkLabel}
                              content={item.featuredLink.label}
                            />
                          )}
                          <div className={classes.featuredLinkWrap}>
                            {item.featuredLink.links &&
                              item.featuredLink.links.map((link, linkIndex) => (
                                <CMSLink
                                  className={classes.featuredLinks}
                                  key={linkIndex}
                                  {...link.link}
                                >
                                  <ArrowIcon />
                                </CMSLink>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                <CrosshairIcon
                  className={[classes.crosshair, classes.crosshairBottomLeft]
                    .filter(Boolean)
                    .join(' ')}
                  size="large"
                />
              </div>
            )
          })}
          <BackgroundScanline />
          <BackgroundGrid zIndex={0} />
          <div className={classes.modalBlur} />
        </Gutter>
      </div>
    </Modal>
  )
}

export const MobileNav: React.FC<NavItems> = props => {
  const { isModalOpen, openModal, closeModal, closeAllModals } = useModal()
  const { headerTheme } = useHeaderObserver()
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
    } else {
      openModal(modalSlug)
    }
  }, [isMenuOpen, closeAllModals, openModal])

  return (
    <div className={classes.mobileNav}>
      <div className={classes.menuBar}>
        <Gutter>
          <div className={'grid'}>
            <div
              className={[classes.menuBarContainer, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}
            >
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
                  className={[classes.modalToggler, isMenuOpen ? classes.hamburgerOpen : '']
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
      <MobileMenuModal {...props} setActiveTab={setActiveTab} theme={headerTheme} />
      <SubMenuModal {...props} activeTab={activeTab} theme={headerTheme} />
    </div>
  )
}
