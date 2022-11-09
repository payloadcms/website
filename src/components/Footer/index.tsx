'use client'

import React from 'react'
import { CMSLink } from '@components/CMSLink'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
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
import classes from './index.module.scss'

export const Footer: React.FC<FooterType> = props => {
  const { columns } = props
  const [itemsUnderLogo, documentationItems] = columns ?? []
  const { setTheme, theme } = useThemePreference()

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    setTheme(themeToSet === 'auto' ? null : themeToSet)
  }

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

            <Cell cols={5} colsM={6}>
              <p className={classes.colHeader}>Stay connected</p>

              <div>
                <Form
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
                </Form>
              </div>
            </Cell>
          </Grid>

          <Grid className={classes.footerMeta}>
            <Cell cols={3}>
              <div className={classes.socialLinks}>
                <InstagramIcon />
                <YoutubeIcon />
                <TwitterIcon />
                <FacebookIcon />
              </div>
            </Cell>

            <Cell cols={4}>
              <p className={classes.copyright}>Copyright 2022 Payload CMS, Inc.</p>
            </Cell>

            <Cell cols={5} colsM={8}>
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
