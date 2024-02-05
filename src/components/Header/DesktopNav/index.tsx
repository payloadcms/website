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

  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const menuItemRefs = [] as (HTMLButtonElement | null)[]

  React.useEffect(() => {
    if (dropdownRef.current && activeTab !== undefined) {
      setBackgroundStyles({
        top: hideBackground ? 0 : undefined,
        height: hideBackground
          ? `${dropdownRef.current.offsetHeight + 100}px`
          : `${dropdownRef.current.offsetHeight}px`,
      })
    }
  }, [activeTab, hideBackground])

  const handleHoverEnter = index => {
    setActiveTab(index)
    setActiveDropdown(true)

    const hoveredMenuItem = menuItemRefs[index]

    if (hoveredMenuItem) {
      setUnderlineStyles({
        width: `${hoveredMenuItem.clientWidth}px`,
        left: hoveredMenuItem.offsetLeft,
      })
    }

    if (dropdownRef.current) {
      setBackgroundStyles({
        top: hideBackground ? 0 : undefined,
        height: hideBackground
          ? `${dropdownRef.current.offsetHeight + 90}px`
          : `${dropdownRef.current.offsetHeight}px`,
      })
    }
  }

  const resetHoverStyles = () => {
    setActiveDropdown(false)
    setActiveTab(undefined)
    setBackgroundStyles({ height: '0px' })
  }

  return (
    <Gutter className={classes.desktopNav}>
      <div className={[classes.grid, 'grid'].filter(Boolean).join(' ')}>
        <div className={[classes.logo, 'cols-4'].filter(Boolean).join(' ')}>
          <Link href="/" className={classes.logo} prefetch={false} aria-label="Full Payload Logo">
            <FullLogo />
          </Link>
        </div>
        <div className={[classes.content, 'cols-8'].filter(Boolean).join(' ')}>
          <div className={classes.tabs} onMouseLeave={resetHoverStyles}>
            {(tabs || []).map((tab, tabIndex) => {
              const isActive = tabIndex === activeTab
              return (
                <div
                  key={tabIndex}
                  onMouseEnter={() => handleHoverEnter(tabIndex)}
                  onFocus={() => handleHoverEnter(tabIndex)}
                >
                  <button
                    className={[classes.tab].filter(Boolean).join(' ')}
                    ref={ref => (menuItemRefs[tabIndex] = ref)}
                  >
                    {tab.label}
                  </button>
                  {isActive && (
                    <div className={[classes.dropdown, 'grid'].join(' ')} ref={dropdownRef}>
                      <div className={[classes.description, 'cols-4'].join(' ')}>
                        {tab.description}
                      </div>
                      {(tab.navItems || []).map((item, index) => {
                        const totalItems = tab.navItems?.length || 0
                        const columnSpan = 12 / totalItems

                        return (
                          <div
                            className={[`cols-${columnSpan}`, classes.dropdownItem].join(' ')}
                            key={index}
                            onClick={resetHoverStyles}
                          >
                            <CMSLink
                              className={[classes.dropdownItemLink].filter(Boolean).join(' ')}
                              {...item.link}
                            >
                              <div className={classes.dropdownItemDescription}>
                                {item.description}
                                <ArrowIcon />
                              </div>
                            </CMSLink>
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
        style={backgroundStyles}
      />
    </Gutter>
  )
}
