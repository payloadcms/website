'use client'

import { CMSLink } from '@components/CMSLink'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import { validateEmail } from '@forms/validations'
import { Gutter } from '@components/Gutter'
import { ArrowIcon } from '@icons/ArrowIcon'
import { PayloadIcon } from '@root/graphics/PayloadIcon'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { analyticsEvent } from '@root/utilities/analytics'
import React from 'react'
import { Footer as FooterType } from '@root/payload-types'

import classes from './index.module.scss'

export const Footer: React.FC<FooterType> = props => {
  const { columns } = props
  const [itemsUnderLogo, documentationItems] = columns ?? []

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

            <Cell cols={5}>
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
                    />
                    <Text path="b_f43c9eb62d4ce02e552a1fa9f_e11798f237" type="hidden" />
                    <ArrowIcon rotation={45} className={classes.inputArrow} />
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
        </Gutter>
      </footer>
    )
  }

  return null
}
