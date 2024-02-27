import * as React from 'react'
import Link from 'next/link'

import { Avatar } from '@components/Avatar'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { DiscordIcon } from '@root/graphics/DiscordIcon'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { MainMenu } from '@root/payload-types'
import { useAuth } from '@root/providers/Auth'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver'
import { FullLogo } from '../../../graphics/FullLogo'
import { CMSLink } from '../../CMSLink'
import { DocSearch } from '../Docsearch'

import classes from './index.module.scss'

type DesktopNavType = Pick<MainMenu, 'tabs'> & { hideBackground?: boolean }
export const DesktopNav: React.FC<DesktopNavType> = ({ tabs, hideBackground }) => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = React.useState<number | undefined>()
  const [activeDropdown, setActiveDropdown] = React.useState<boolean | undefined>(false)
  const [backgroundStyles, setBackgroundStyles] = React.useState<any>({ height: '0px' })
  const [underlineStyles, setUnderlineStyles] = React.useState<any>({})
  const { headerTheme } = useHeaderObserver()
  const [activeDropdownItem, setActiveDropdownItem] = React.useState<number | undefined>(undefined)

  const menuItemRefs = [] as (HTMLButtonElement | null)[]
  const dropdownMenuRefs = [] as (HTMLDivElement | null)[]

  const handleHoverEnter = index => {
    setActiveTab(index)
    setActiveDropdown(true)

    const hoveredMenuItem = menuItemRefs[index]
    const hoveredDropdownMenu = dropdownMenuRefs[index]

    if (hoveredMenuItem) {
      setUnderlineStyles({
        width: `${hoveredMenuItem.clientWidth}px`,
        left: hoveredMenuItem.offsetLeft,
      })
    }
    const bgHeight = hoveredDropdownMenu?.clientHeight || 0

    setBackgroundStyles({
      top: hideBackground ? 0 : undefined,
      height: hideBackground ? `${bgHeight + 90}px` : `${bgHeight}px`,
    })
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
            <Link href="/" className={classes.logo} prefetch={false} aria-label="Full Payload Logo">
              <FullLogo />
            </Link>
          </div>
          <div className={[classes.content, 'cols-8'].join(' ')}>
            <div className={classes.tabs} onMouseLeave={resetHoverStyles}>
              {(tabs || []).map((tab, tabIndex) => {
                return (
                  <div
                    key={tabIndex}
                    onMouseEnter={() => handleHoverEnter(tabIndex)}
                    onFocus={() => handleHoverEnter(tabIndex)}
                  >
                    <button className={classes.tab} ref={ref => (menuItemRefs[tabIndex] = ref)}>
                      {tab.enableDirectLink ? (
                        <CMSLink className={classes.directLink} {...tab.link} label={tab.label}>
                          {tab.link?.newTab && tab.link.type === 'custom' && (
                            <ArrowIcon size="medium" className={classes.tabArrow} />
                          )}
                        </CMSLink>
                      ) : (
                        <>{tab.label}</>
                      )}
                    </button>
                    {tab.enableDropdown && (
                      <div
                        className={[
                          'grid',
                          classes.dropdown,
                          tabIndex === activeTab && classes.activeTab,
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        ref={ref => (dropdownMenuRefs[tabIndex] = ref)}
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
                                  <ArrowIcon size="medium" />
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
                              navItem => navItem.style === 'featured',
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
                                onClick={resetHoverStyles}
                                onMouseEnter={() => setActiveDropdownItem(index)}
                                key={index}
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
                                        />
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
                                            <ArrowIcon size="medium" />
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
                className={classes.underline}
                style={{ ...underlineStyles, opacity: activeDropdown ? 1 : 0 }}
                aria-hidden="true"
              >
                <div className={classes.underlineFill} />
              </div>
            </div>
          </div>
          <div className={'cols-4'}>
            <div
              className={[classes.secondaryNavItems, user !== undefined && classes.show].join(' ')}
            >
              <Link href="/new" prefetch={false}>
                New project
              </Link>
              {user ? (
                <Avatar className={classes.avatar} />
              ) : (
                <Link prefetch={false} href="/login">
                  Login
                </Link>
              )}
              <div className={classes.icons}>
                <a
                  className={classes.discord}
                  href="https://discord.com/invite/r6sCXqVk3v"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Payload's Discord"
                >
                  <DiscordIcon />
                </a>
                <DocSearch />
              </div>
            </div>
          </div>
        </div>
        <div
          className={classes.background}
          onMouseEnter={() => setActiveDropdown(true)}
          onMouseLeave={() => setActiveDropdown(false)}
          style={
            activeDropdown ? backgroundStyles : { height: '0px', transition: 'all 0.3s linear' }
          }
        />
      </Gutter>
    </div>
  )
}
