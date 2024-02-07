import * as React from 'react'
import Link from 'next/link'

import { Avatar } from '@components/Avatar'
import { Gutter } from '@components/Gutter'
import { DiscordIcon } from '@root/graphics/DiscordIcon'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { MainMenu } from '@root/payload-types'
import { useAuth } from '@root/providers/Auth'
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

    if (hoveredDropdownMenu) {
      setBackgroundStyles({
        top: hideBackground ? 0 : undefined,
        height: hideBackground
          ? `${hoveredDropdownMenu.clientHeight + 90}px`
          : `${hoveredDropdownMenu.clientHeight}px`,
      })
    }
  }

  const resetHoverStyles = () => {
    setActiveDropdown(false)
    setActiveTab(undefined)
    setBackgroundStyles({ height: '0px' })
  }

  return (
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
            {(tabs || []).map((tab, tabIndex) => (
              <div
                key={tabIndex}
                onMouseEnter={() => handleHoverEnter(tabIndex)}
                onFocus={() => handleHoverEnter(tabIndex)}
              >
                <button className={classes.tab} ref={ref => (menuItemRefs[tabIndex] = ref)}>
                  {tab.label}
                </button>
                <div
                  className={['grid', classes.dropdown, tabIndex === activeTab && classes.activeTab]
                    .filter(Boolean)
                    .join(' ')}
                  ref={ref => (dropdownMenuRefs[tabIndex] = ref)}
                >
                  <div className={[classes.description, 'cols-4'].join(' ')}>{tab.description}</div>
                  {(tab.navItems || []).map((item, index) => {
                    const totalItems = tab.navItems?.length || 0
                    const columnSpan = 12 / totalItems

                    return (
                      <div
                        className={[`cols-${columnSpan}`, classes.dropdownItem].join(' ')}
                        onClick={resetHoverStyles}
                        key={index}
                      >
                        <CMSLink className={classes.dropdownItemLink} {...item.link}>
                          <div className={classes.dropdownItemDescription}>
                            {item.description}
                            <ArrowIcon className={classes.arrow} />
                          </div>
                        </CMSLink>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
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
        style={activeDropdown ? backgroundStyles : { height: '0px', transition: 'all 0.3s linear' }}
      />
    </Gutter>
  )
}
