'use client'

import React, { useId } from 'react'
import { Text } from '@forms/fields/Text/index.js'
import FormComponent from '@forms/Form/index.js'
import { validateEmail } from '@forms/validations.js'
import { ArrowIcon } from '@icons/ArrowIcon/index.js'
import { Footer as FooterType } from '@types'
import { usePathname, useRouter } from 'next/navigation'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { CMSLink } from '@components/CMSLink/index.js'
import { Gutter } from '@components/Gutter/index.js'
import Payload3D from '@components/Payload3D/index.js'
import { DiscordIcon } from '@root/graphics/DiscordIcon/index.js'
import { FacebookIcon } from '@root/graphics/FacebookIcon/index.js'
import { InstagramIcon } from '@root/graphics/InstagramIcon/index.js'
import { ThemeAutoIcon } from '@root/graphics/ThemeAutoIcon/index.js'
import { ThemeDarkIcon } from '@root/graphics/ThemeDarkIcon/index.js'
import { ThemeLightIcon } from '@root/graphics/ThemeLightIcon/index.js'
import { TwitterIconAlt } from '@root/graphics/TwitterIconAlt/index.js'
import { YoutubeIcon } from '@root/graphics/YoutubeIcon/index.js'
import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon/index.js'
import { useHeaderObserver } from '@root/providers/HeaderIntersectionObserver/index.js'
import { useThemePreference } from '@root/providers/Theme/index.js'
import { getImplicitPreference, themeLocalStorageKey } from '@root/providers/Theme/shared.js'
import { Theme } from '@root/providers/Theme/types.js'

import classes from './index.module.scss'
import { NewsletterSignUp } from '@components/NewsletterSignUp'

export const Footer: React.FC<FooterType> = props => {
  const { columns } = props
  const [products, developers, company] = columns ?? []
  const { setTheme } = useThemePreference()
  const { setHeaderTheme } = useHeaderObserver()
  const wrapperRef = React.useRef<HTMLElement>(null)
  const selectRef = React.useRef<HTMLSelectElement>(null)

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      const implicitPreference = getImplicitPreference() ?? 'light'
      setHeaderTheme(implicitPreference)
      setTheme(implicitPreference)
      if (selectRef.current) selectRef.current.value = 'auto'
    } else {
      setTheme(themeToSet)
      setHeaderTheme(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    if (selectRef.current) {
      selectRef.current.value = preference ?? 'auto'
    }
  }, [])

  const pathname = usePathname()

  const allowedSegments = [
    'cloud',
    'cloud-terms',
    'forgot-password',
    'join-team',
    'login',
    'logout',
    'new',
    'reset-password',
    'verify',
    'signup',
  ]

  const pathnameSegments = pathname.split('/').filter(Boolean)
  const isCloudPage = pathnameSegments.some(segment => allowedSegments.includes(segment))

  const themeId = useId()

  return (
    <footer ref={wrapperRef} className={classes.footer} data-theme="dark">
      <BackgroundGrid
        zIndex={2}
        className={[classes.background, isCloudPage ? classes.topBorder : '']
          .filter(Boolean)
          .join(' ')}
      />
      <Gutter className={classes.container}>
        <div className={[classes.grid, 'grid'].filter(Boolean).join(' ')}>
          <div className={['cols-4 cols-m-8 cols-s-8'].filter(Boolean).join(' ')}>
            <p className={classes.colHeader}>{products?.label}</p>
            <div className={classes.colItems}>
              {products?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className={['cols-4 cols-m-8 cols-s-8'].filter(Boolean).join(' ')}>
            <p className={classes.colHeader}>{developers?.label}</p>
            <div className={classes.colItems}>
              {developers?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className={['cols-4 cols-m-8 cols-s-8'].filter(Boolean).join(' ')}>
            <p className={classes.colHeader}>{company?.label}</p>
            <div className={classes.colItems}>
              {company?.navItems?.map(({ link }, index) => {
                return (
                  <React.Fragment key={index}>
                    <CMSLink className={classes.link} {...link} />
                  </React.Fragment>
                )
              })}
            </div>
          </div>

          <div className={['cols-4 cols-m-4 cols-s-8'].filter(Boolean).join(' ')}>
            <p className={`${classes.colHeader} ${classes.thirdColumn}`}>Stay connected</p>
            <NewsletterSignUp />

            <div className={classes.socialLinks}>
              <a
                href="https://www.instagram.com/payloadcms/"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.socialIconLink}
                aria-label="Payload's Instagram page"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.youtube.com/channel/UCyrx4Wpd4SBIpqUKlkb6N1Q"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.socialIconLink}
                aria-label="Payload's YouTube channel"
              >
                <YoutubeIcon />
              </a>
              <a
                href="https://twitter.com/payloadcms"
                target="_blank"
                rel="noopener noreferrer"
                className={`${classes.socialIconLink} ${classes.twitterIcon}`}
                aria-label="Payload's Twitter page"
              >
                <TwitterIconAlt />
              </a>
              <a
                href="https://www.facebook.com/payloadcms/"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.socialIconLink}
                aria-label="Payload's Facebook page"
              >
                <FacebookIcon />
              </a>
              <a
                href="https://discord.com/invite/r6sCXqVk3v"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.socialIconLink}
                aria-label="Payload's Discord"
              >
                <DiscordIcon />
              </a>
            </div>

            <div className={classes.selectContainer}>
              <label className="visually-hidden" htmlFor={themeId}>
                Switch themes
              </label>
              {selectRef?.current && (
                <div className={`${classes.switcherIcon} ${classes.themeIcon}`}>
                  {selectRef.current.value === 'auto' && <ThemeAutoIcon />}
                  {selectRef.current.value === 'light' && <ThemeLightIcon />}
                  {selectRef.current.value === 'dark' && <ThemeDarkIcon />}
                </div>
              )}

              <select
                id={themeId}
                onChange={e => onThemeChange(e.target.value as Theme & 'auto')}
                ref={selectRef}
              >
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>

              <ChevronUpDownIcon
                className={`${classes.switcherIcon} ${classes.upDownChevronIcon}`}
              />
            </div>
          </div>
        </div>
      </Gutter>
      <Gutter className={classes.payload3dContainer}>
        <Payload3D />
      </Gutter>
    </footer>
  )
}
