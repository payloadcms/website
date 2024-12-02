import * as React from 'react'
import { Modal, useModal } from '@faceless-ui/modal'
import Link from 'next/link'

import { usePathname } from 'next/navigation'

import { Avatar } from '@components/Avatar/index.js'
import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { RichText } from '@components/RichText/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index.js'
import { MainMenu } from '@root/payload-types.js'
import { useAuth } from '@root/providers/Auth/index.js'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver/index.js'
import { Theme } from '@root/providers/Theme/types.js'
import { FullLogo } from '../../../graphics/FullLogo/index.js'
import { MenuIcon } from '../../../graphics/MenuIcon/index.js'
import { CMSLink } from '../../CMSLink/index.js'
import { DocSearch } from '../Docsearch/index.js'
import { GitHubIcon } from '@root/graphics/GitHub/index.js'

import classes from './index.module.scss'
import { useStarCount } from '@root/utilities/use-star-count.js'

export const modalSlug = 'mobile-nav'
export const subMenuSlug = 'mobile-sub-menu'

type NavItems = Pick<MainMenu, 'tabs' | 'menuCta'>

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
        const { link, label, enableDirectLink, enableDropdown } = tab

        if (!enableDropdown)
          return <CMSLink {...link} className={classes.mobileMenuItem} key={index} label={label} />

        if (enableDirectLink)
          return (
            <button
              onClick={() => handleOnClick(index)}
              className={classes.mobileMenuItem}
              key={index}
            >
              <CMSLink
                className={classes.directLink}
                {...link}
                label={label}
                onClick={e => {
                  e.stopPropagation()
                }}
              />
              <ArrowIcon size="medium" rotation={45} />
            </button>
          )
        else
          return (
            <CMSLink
              {...link}
              className={classes.mobileMenuItem}
              key={index}
              label={label}
              onClick={() => handleOnClick(index)}
            >
              <ArrowIcon size="medium" rotation={45} />
            </CMSLink>
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
      <Gutter className={classes.mobileMenuWrap} rightGutter={false} dataTheme={`${theme}`}>
        <MobileNavItems tabs={tabs} setActiveTab={setActiveTab} />
        <BackgroundGrid zIndex={0} />
        <BackgroundScanline />
        <div className={classes.modalBlur} />
      </Gutter>
    </Modal>
  )
}

const SubMenuModal: React.FC<
  NavItems & {
    activeTab: number | undefined
    theme?: Theme | null
  }
> = ({ tabs, activeTab, theme }) => {
  const { closeModal, closeAllModals } = useModal()

  return (
    <Modal
      slug={subMenuSlug}
      className={[classes.mobileMenuModal, classes.mobileSubMenu].join(' ')}
      trapFocus={false}
      onClick={closeAllModals}
    >
      <Gutter className={classes.subMenuWrap} dataTheme={`${theme}`}>
        {(tabs || []).map((tab, tabIndex) => {
          if (tabIndex !== activeTab) return null
          return (
            <div className={classes.subMenuItems} key={tabIndex}>
              <button
                className={classes.backButton}
                onClick={e => {
                  closeModal(subMenuSlug)
                  e.stopPropagation()
                }}
              >
                <ArrowIcon size="medium" rotation={225} />
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

export const MobileNav: React.FC<NavItems> = props => {
  const { isModalOpen, openModal, closeAllModals } = useModal()
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
                href="/"
                className={classes.logo}
                prefetch={false}
                aria-label="Full Payload Logo"
              >
                <FullLogo className="w-auto h-[30px]" />
              </Link>
              <div className={classes.icons}>
                <a
                  className={classes.github}
                  href="https://github.com/payloadcms/payload"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Payload's GitHub"
                >
                  <GitHubIcon />
                  {starCount}
                </a>
                {user && <Avatar className={classes.avatar} />}
                <DocSearch />
                <div
                  className={[classes.modalToggler, isMenuOpen ? classes.hamburgerOpen : '']
                    .filter(Boolean)
                    .join(' ')}
                  onClick={toggleModal}
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
