import type { MainMenu } from '@root/payload-types'
import type { Theme } from '@root/providers/Theme/types'

import { Avatar } from '@components/Avatar/index'
import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import { Modal, useModal } from '@faceless-ui/modal'
import { GitHubIcon } from '@root/graphics/GitHub/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index'
import { useAuth } from '@root/providers/Auth/index'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver/index'
import { useStarCount } from '@root/utilities/use-star-count'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { FullLogo } from '../../../graphics/FullLogo/index'
import { MenuIcon } from '../../../graphics/MenuIcon/index'
import { CMSLink } from '../../CMSLink/index'
import { DocSearch } from '../Docsearch/index'
import classes from './index.module.scss'

export const modalSlug = 'mobile-nav'
export const subMenuSlug = 'mobile-sub-menu'

type NavItems = Pick<MainMenu, 'menuCta' | 'tabs'>

const MobileNavItems = ({ setActiveTab, tabs }) => {
  const { user } = useAuth()
  const { openModal } = useModal()
  const handleOnClick = (index) => {
    openModal(subMenuSlug)
    setActiveTab(index)
  }

  return (
    <ul className={classes.mobileMenuItems}>
      {(tabs || []).map((tab, index) => {
        const { enableDirectLink, enableDropdown, label, link } = tab

        if (!enableDropdown) {
          return <CMSLink {...link} className={classes.mobileMenuItem} key={index} label={label} />
        }

        if (enableDirectLink) {
          return (
            <button
              className={classes.mobileMenuItem}
              key={index}
              onClick={() => handleOnClick(index)}
            >
              <CMSLink
                className={classes.directLink}
                {...link}
                label={label}
                onClick={(e) => {
                  e.stopPropagation()
                }}
              />
              <ArrowIcon rotation={45} size="medium" />
            </button>
          )
        } else {
          return (
            <CMSLink
              {...link}
              className={classes.mobileMenuItem}
              key={index}
              label={label}
              onClick={() => handleOnClick(index)}
            >
              <ArrowIcon rotation={45} size="medium" />
            </CMSLink>
          )
        }
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
  {
    setActiveTab: (index: number) => void
    theme?: null | Theme
  } & NavItems
> = ({ setActiveTab, tabs, theme }) => {
  return (
    <Modal className={classes.mobileMenuModal} slug={modalSlug} trapFocus={false}>
      <Gutter className={classes.mobileMenuWrap} dataTheme={`${theme}`} rightGutter={false}>
        <MobileNavItems setActiveTab={setActiveTab} tabs={tabs} />
        <BackgroundGrid zIndex={0} />
        <BackgroundScanline />
        <div className={classes.modalBlur} />
      </Gutter>
    </Modal>
  )
}

const SubMenuModal: React.FC<
  {
    activeTab: number | undefined
    theme?: null | Theme
  } & NavItems
> = ({ activeTab, tabs, theme }) => {
  const { closeAllModals, closeModal } = useModal()

  return (
    <Modal
      className={[classes.mobileMenuModal, classes.mobileSubMenu].join(' ')}
      onClick={closeAllModals}
      slug={subMenuSlug}
      trapFocus={false}
    >
      <Gutter className={classes.subMenuWrap} dataTheme={`${theme}`}>
        {(tabs || []).map((tab, tabIndex) => {
          if (tabIndex !== activeTab) {
            return null
          }
          return (
            <div className={classes.subMenuItems} key={tabIndex}>
              <button
                className={classes.backButton}
                onClick={(e) => {
                  closeModal(subMenuSlug)
                  e.stopPropagation()
                }}
              >
                <ArrowIcon rotation={225} size="medium" />
                Back
                <CrosshairIcon
                  className={[classes.crosshair, classes.crosshairTopLeft]
                    .filter(Boolean)
                    .join(' ')}
                  size="large"
                />
              </button>
              {tab.descriptionLinks && tab.descriptionLinks.length > 0 && (
                <div className={classes.descriptionLinks}>
                  {tab.descriptionLinks.map((link, linkIndex) => (
                    <CMSLink className={classes.descriptionLink} key={linkIndex} {...link.link}>
                      <ArrowIcon className={classes.linkArrow} />
                    </CMSLink>
                  ))}
                </div>
              )}
              {(tab.navItems || []).map((item, index) => {
                return (
                  <div className={classes.linkWrap} key={index}>
                    {item.style === 'default' && item.defaultLink && (
                      <CMSLink className={classes.defaultLink} {...item.defaultLink.link} label="">
                        <div className={classes.listLabelWrap}>
                          <div className={classes.listLabel}>
                            {item.defaultLink.link.label}
                            <ArrowIcon rotation={0} size="medium" />
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
                              <CMSLink className={classes.link} key={linkIndex} {...link.link}>
                                {link.link?.newTab && link.link?.type === 'custom' && (
                                  <ArrowIcon className={classes.linkArrow} />
                                )}
                              </CMSLink>
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
    </Modal>
  )
}

export const MobileNav: React.FC<NavItems> = (props) => {
  const { closeAllModals, isModalOpen, openModal } = useModal()
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

  const starCount = useStarCount()

  return (
    <div className={classes.mobileNav}>
      <div className={classes.menuBar}>
        <Gutter>
          <div className={'grid'}>
            <div
              className={[classes.menuBarContainer, 'cols-16 cols-m-8'].filter(Boolean).join(' ')}
            >
              <Link
                aria-label="Full Payload Logo"
                className={classes.logo}
                href="/"
                prefetch={false}
              >
                <FullLogo className="w-auto h-[30px]" />
              </Link>
              <div className={classes.icons}>
                <a
                  aria-label="Payload's GitHub"
                  className={classes.github}
                  href="https://github.com/payloadcms/payload"
                  rel="noreferrer"
                  target="_blank"
                >
                  <GitHubIcon />
                  {starCount}
                </a>
                {user && <Avatar className={classes.avatar} />}
                <DocSearch />
                <div
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  className={[classes.modalToggler, isMenuOpen ? classes.hamburgerOpen : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={toggleModal}
                >
                  <MenuIcon />
                </div>
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
