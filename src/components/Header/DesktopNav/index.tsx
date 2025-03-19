import type { MainMenu } from '@root/payload-types'

import { Avatar } from '@components/Avatar/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import { GitHubIcon } from '@root/graphics/GitHub/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import { useAuth } from '@root/providers/Auth/index'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver/index'
import { useStarCount } from '@root/utilities/use-star-count'
import Link from 'next/link'
import * as React from 'react'

import { FullLogo } from '../../../graphics/FullLogo/index'
import { CMSLink } from '../../CMSLink/index'
import { DocSearch } from '../Docsearch/index'
import classes from './index.module.scss'

type DesktopNavType = { hideBackground?: boolean } & Pick<MainMenu, 'menuCta' | 'tabs'>
export const DesktopNav: React.FC<DesktopNavType> = ({ hideBackground, menuCta, tabs }) => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = React.useState<number | undefined>()
  const [activeDropdown, setActiveDropdown] = React.useState<boolean | undefined>(false)
  const [backgroundStyles, setBackgroundStyles] = React.useState<any>({
    height: '0px',
  })
  const bgHeight = hideBackground ? { top: '0px' } : ''
  const [underlineStyles, setUnderlineStyles] = React.useState<any>({})
  const { headerTheme } = useHeaderObserver()
  const [activeDropdownItem, setActiveDropdownItem] = React.useState<number | undefined>(undefined)

  const menuItemRefs = [] as (HTMLButtonElement | null)[]
  const dropdownMenuRefs = [] as (HTMLDivElement | null)[]

  const starCount = useStarCount()

  React.useEffect(() => {
    if (activeTab !== undefined) {
      const hoveredDropdownMenu = dropdownMenuRefs[activeTab]
      const bgHeight = hoveredDropdownMenu?.clientHeight || 0
      if (bgHeight === 0) {
        setBackgroundStyles({ height: '0px' })
        setActiveDropdown(undefined)
      } else {
        setBackgroundStyles({
          height: hideBackground ? `${bgHeight + 90}px` : `${bgHeight}px`,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideBackground])
  const hoverTimeout = React.useRef<null | number>(null)

  const handleMouseEnter = (args) => {
    if (!activeDropdown) {
      hoverTimeout.current = window.setTimeout(() => {
        handleHoverEnter(args)
      }, 200)
    } else {
      handleHoverEnter(args)
    }
  }

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
      hoverTimeout.current = null
    }
  }

  const handleHoverEnter = (index) => {
    setActiveTab(index)
    setActiveDropdown(true)

    const hoveredMenuItem = menuItemRefs[index]
    const hoveredDropdownMenu = dropdownMenuRefs[index]
    const bgHeight = hoveredDropdownMenu?.clientHeight || 0

    if (hoveredMenuItem) {
      setUnderlineStyles({
        left: hoveredMenuItem.offsetLeft,
        width: `${hoveredMenuItem.clientWidth}px`,
      })
    }

    if (bgHeight === 0) {
      setBackgroundStyles({ height: '0px' })
      setActiveDropdown(undefined)
    } else {
      setBackgroundStyles({
        height: hideBackground ? `${bgHeight + 90}px` : `${bgHeight}px`,
      })
    }

    setActiveDropdownItem(undefined)
  }

  const resetHoverStyles = () => {
    setActiveDropdown(false)
    setActiveTab(undefined)
    setBackgroundStyles({ height: '0px' })
  }

  return (
    <div
      className={[classes.desktopNav, headerTheme && classes[headerTheme]]
        .filter(Boolean)
        .join(' ')}
      style={{ width: '100%' }}
    >
      <Gutter
        className={[classes.desktopNav, activeDropdown && classes.active].filter(Boolean).join(' ')}
      >
        <div className={[classes.grid, 'grid'].join(' ')}>
          <div className={[classes.logo, 'cols-4'].join(' ')}>
            <Link aria-label="Full Payload Logo" className={classes.logo} href="/" prefetch={false}>
              <FullLogo className="w-auto h-[30px]" />
            </Link>
          </div>
          <div className={[classes.content, 'cols-8'].join(' ')}>
            <div className={classes.tabs} onMouseLeave={resetHoverStyles}>
              {(tabs || []).map((tab, tabIndex) => {
                const { enableDirectLink = false, enableDropdown = false } = tab
                return (
                  <div
                    key={tabIndex}
                    onMouseEnter={() => handleMouseEnter(tabIndex)}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <button
                      className={classes.tab}
                      ref={(ref) => {
                        menuItemRefs[tabIndex] = ref
                      }}
                    >
                      {enableDirectLink ? (
                        <CMSLink className={classes.directLink} {...tab.link} label={tab.label}>
                          {tab.link?.newTab && tab.link.type === 'custom' && (
                            <ArrowIcon className={classes.tabArrow} />
                          )}
                        </CMSLink>
                      ) : (
                        <>{tab.label}</>
                      )}
                    </button>
                    {enableDropdown && (
                      <div
                        className={[
                          'grid',
                          classes.dropdown,
                          tabIndex === activeTab && classes.activeTab,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={resetHoverStyles}
                        ref={(ref) => {
                          dropdownMenuRefs[tabIndex] = ref
                        }}
                      >
                        <div className={[classes.description, 'cols-4'].join(' ')}>
                          {tab.description}
                          {tab.descriptionLinks && (
                            <div className={classes.descriptionLinks}>
                              {tab.descriptionLinks.map((link, linkIndex) => (
                                <CMSLink
                                  className={classes.descriptionLink}
                                  key={linkIndex}
                                  {...link.link}
                                >
                                  <ArrowIcon className={classes.linkArrow} />
                                </CMSLink>
                              ))}
                            </div>
                          )}
                        </div>
                        {tab.navItems &&
                          tab.navItems?.map((item, index) => {
                            const isActive = activeDropdownItem === index
                            let columnSpan = 12 / (tab.navItems?.length || 1)
                            const containsFeatured = tab.navItems?.some(
                              (navItem) => navItem.style === 'featured',
                            )
                            const showUnderline = isActive && item.style === 'default'

                            if (containsFeatured) {
                              columnSpan = item.style === 'featured' ? 6 : 3
                            }
                            return (
                              <div
                                className={[
                                  `cols-${columnSpan}`,
                                  classes.dropdownItem,
                                  showUnderline && classes.showUnderline,
                                ].join(' ')}
                                key={index}
                                onMouseEnter={() => setActiveDropdownItem(index)}
                              >
                                {item.style === 'default' && item.defaultLink && (
                                  <CMSLink
                                    className={classes.defaultLink}
                                    {...item.defaultLink.link}
                                    label=""
                                  >
                                    <div className={classes.defaultLinkLabel}>
                                      {item.defaultLink.link.label}
                                    </div>
                                    <div className={classes.defaultLinkDescription}>
                                      {item.defaultLink.description}
                                      <ArrowIcon size="medium" />
                                    </div>
                                  </CMSLink>
                                )}
                                {item.style === 'list' && item.listLinks && (
                                  <div className={classes.linkList}>
                                    <div className={classes.listLabel}>{item.listLinks.tag}</div>
                                    {item.listLinks.links &&
                                      item.listLinks.links.map((link, linkIndex) => (
                                        <CMSLink
                                          className={classes.link}
                                          key={linkIndex}
                                          {...link.link}
                                        >
                                          {link.link?.newTab && link.link?.type === 'custom' && (
                                            <ArrowIcon className={classes.linkArrow} />
                                          )}
                                        </CMSLink>
                                      ))}
                                  </div>
                                )}
                                {item.style === 'featured' && item.featuredLink && (
                                  <div className={classes.featuredLink}>
                                    <div className={classes.listLabel}>{item.featuredLink.tag}</div>
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
                                            <ArrowIcon className={classes.linkArrow} />
                                          </CMSLink>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>
                )
              })}
              <div
                aria-hidden="true"
                className={classes.underline}
                style={{ ...underlineStyles, opacity: activeDropdown || activeTab ? 1 : 0 }}
              >
                <div className={classes.underlineFill} />
              </div>
            </div>
          </div>
          <div className={'cols-4'}>
            <div
              className={[classes.secondaryNavItems, user !== undefined && classes.show].join(' ')}
            >
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
              {user ? (
                <Avatar className={classes.avatar} />
              ) : (
                <>
                  <Link href="/login" prefetch={false}>
                    Login
                  </Link>
                  {menuCta && menuCta.label && <CMSLink {...menuCta} className={classes.button} />}
                </>
              )}
              <DocSearch />
            </div>
          </div>
        </div>
        <div className={classes.background} style={{ ...backgroundStyles, ...bgHeight }} />
      </Gutter>
    </div>
  )
}
