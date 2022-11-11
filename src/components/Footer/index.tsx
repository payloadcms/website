'use client'

import React from 'react'
import { CMSLink } from '@components/CMSLink'
import { Text } from '@forms/fields/Text'
import { validateEmail } from '@forms/validations'
import { Gutter } from '@components/Gutter'
import { ArrowIcon } from '@icons/ArrowIcon'
import { PayloadIcon } from '@root/graphics/PayloadIcon'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { analyticsEvent } from '@root/utilities/analytics'
import { Footer as FooterType } from '@types'

import { InstagramIcon } from '@root/graphics/InstagramIcon'
import { YoutubeIcon } from '@root/graphics/YoutubeIcon'
import { TwitterIcon } from '@root/graphics/TwitterIcon'
import { FacebookIcon } from '@root/graphics/FacebookIcon'
import { ThemeAutoIcon } from '@root/graphics/ThemeAutoIcon'
import { ThemeLightIcon } from '@root/graphics/ThemeLightIcon'
import { ThemeDarkIcon } from '@root/graphics/ThemeDarkIcon'
import { useThemePreference } from '@root/providers/Theme'

import { Theme } from '@root/providers/Theme/types'
import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon'
import { getImplicitPreference, themeLocalStorageKey } from '@root/providers/Theme/shared'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import classes from './index.module.scss'

export const Footer: React.FC<FooterType> = props => {
  const { columns } = props
  const [itemsUnderLogo, documentationItems] = columns ?? []
  const { setTheme, theme } = useThemePreference()
  const { setHeaderColor } = useHeaderTheme()
  const selectRef = React.useRef<HTMLSelectElement>(null)

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      const implicitPreference = getImplicitPreference()
      setHeaderColor(implicitPreference ?? 'light')
      setTheme(null)
    } else {
      setTheme(themeToSet)
      setHeaderColor(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    if (selectRef.current) {
      selectRef.current.value = preference ?? 'auto'
    }
  }, [])

  if (Array.isArray(itemsUnderLogo.navItems) && Array.isArray(documentationItems.navItems)) {
    return (
      <footer className={classes.footer}>
        <Gutter>
          <Grid>
            <Cell cols={3} colsM={4}>
              <div className={classes.colHeader}>
                <PayloadIcon />
              </div>

              <div>
                {itemsUnderLogo.navItems.map(({ link }, index) => {
                  return <CMSLink key={index} className={classes.link} {...link} />
                })}
              </div>
            </Cell>

            <Cell cols={4} colsM={4}>
              <p className={classes.colHeader}>Documentation</p>
              <div className={classes.col2Items}>
                {itemsUnderLogo.navItems.map(({ link }, index) => {
                  return (
                    <React.Fragment key={index}>
                      <CMSLink className={classes.link} {...link} />
                    </React.Fragment>
                  )
                })}
              </div>
            </Cell>

            <Cell cols={5} colsM={6} colsS={8}>
              <p className={`${classes.colHeader} ${classes.thirdColumn}`}>Stay connected</p>

              <div>
                <form
                  method="POST"
                  action="https://payloadcms.us18.list-manage.com/subscribe/post?u=f43c9eb62d4ce02e552a1fa9f&amp;id=e11798f237"
                  onSubmit={() => analyticsEvent('newsletter')}
                >
                  <div className={classes.inputWrap}>
                    <Text
                      path="EMAIL"
                      required
                      placeholder="Enter your email"
                      validate={validateEmail}
                      className={classes.emailInput}
                    />
                    <Text path="b_f43c9eb62d4ce02e552a1fa9f_e11798f237" type="hidden" />
                    <ArrowIcon className={classes.inputArrow} />
                  </div>

                  <div className={classes.subscribeAction}>
                    <p className={classes.subscribeDesc}>
                      Sign up to receive periodic updates and feature releases to your email.
                    </p>
                    <button className={classes.ok} type="submit">
                      OK
                    </button>
                  </div>
                </form>
              </div>
            </Cell>
          </Grid>

          <Grid className={classes.footerMeta}>
            <Cell cols={3} colsM={5}>
              <div className={classes.socialLinks}>
                <a
                  href="https://www.instagram.com/payloadcms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialIconLink}
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://www.youtube.com/channel/UCyrx4Wpd4SBIpqUKlkb6N1Q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialIconLink}
                >
                  <YoutubeIcon />
                </a>
                <a
                  href="https://twitter.com/payloadcms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialIconLink}
                >
                  <TwitterIcon />
                </a>
                <a
                  href="https://www.facebook.com/payloadcms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.socialIconLink}
                >
                  <FacebookIcon />
                </a>
              </div>
            </Cell>

            <Cell cols={4} colsM={8}>
              <p className={classes.copyright}>Copyright 2022 Payload CMS, Inc.</p>
            </Cell>

            <Cell cols={5} colsM={8} className={classes.themeCell}>
              <div className={classes.selectContainer}>
                <label htmlFor="theme">
                  <div className={`${classes.switcherIcon} ${classes.themeIcon}`}>
                    {!theme && <ThemeAutoIcon />}
                    {theme === 'light' && <ThemeLightIcon />}
                    {theme === 'dark' && <ThemeDarkIcon />}
                  </div>

                  <select
                    id="theme"
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
                </label>
              </div>
            </Cell>
          </Grid>
        </Gutter>
      </footer>
    )
  }

  return null
}
