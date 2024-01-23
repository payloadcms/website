import * as React from 'react'
import Link from 'next/link'

import { Avatar } from '@components/Avatar'
import { Gutter } from '@components/Gutter'
import { DiscordIcon } from '@root/graphics/DiscordIcon'
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
  const [activeDropdown, setActiveDropdown] = React.useState<boolean | undefined>(undefined)
  const [backgroundStyles, setBackgroundStyles] = React.useState<any>({ height: '0px' })
  const [underlineStyles, setUnderlineStyles] = React.useState<any>({})

  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const menuItemRefs = [] as (HTMLButtonElement | null)[]

  React.useEffect(() => {
    if (dropdownRef.current && activeTab !== undefined) {
      setBackgroundStyles({
        top: hideBackground ? 0 : undefined,
        height: hideBackground
          ? `${dropdownRef.current.offsetHeight + 90}px`
          : `${dropdownRef.current.offsetHeight}px`,
      })
    }
  }, [activeDropdown, activeTab, dropdownRef, hideBackground])

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
        <div className={'cols-3'}>
          <Link href="/" className={classes.logo} prefetch={false} aria-label="Full Payload Logo">
            <FullLogo />
          </Link>
        </div>
        <div className={[classes.content, 'cols-9'].filter(Boolean).join(' ')}>
          <div className={classes.tabs} onMouseLeave={resetHoverStyles}>
            {(tabs || []).map((tab, index) => {
              return (
                <div key={index}>
                  <button
                    className={[classes.tab, index === activeTab && classes.active]
                      .filter(Boolean)
                      .join(' ')}
                    key={index}
                    onMouseEnter={() => handleHoverEnter(index)}
                    onFocus={() => handleHoverEnter(index)}
                    ref={ref => (menuItemRefs[index] = ref)}
                  >
                    {tab.label}
                  </button>
                  {index === activeTab && (
                    <div
                      className={classes.navItems}
                      onMouseEnter={() => handleHoverEnter(index)}
                      onFocus={() => handleHoverEnter(index)}
                      onMouseLeave={resetHoverStyles}
                      ref={dropdownRef}
                    >
                      {(tab.navItems || []).map((item, index) => {
                        return <CMSLink className={classes.navItem} key={index} {...item.link} />
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
