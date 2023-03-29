'use client'

import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { ThemeProvider, useTheme } from '@providers/Theme'
import { formatDate } from '@utilities/format-date-time'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { HeaderObserver } from '@components/HeaderObserver'
import { PixelBackground } from '@components/PixelBackground'
import { RichText } from '@components/RichText'
import { Video } from '@components/RichText/Video'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const LivestreamHero: React.FC<
  Page['hero'] & {
    breadcrumbs?: Page['breadcrumbs']
  }
> = props => {
  const {
    breadcrumbs,
    livestream: { id: youtubeID = '', hideBreadcrumbs, date, guests, richText },
    links,
  } = props
  const theme = useTheme()

  const today = new Date()
  const liveDate = new Date(date)
  const isLive = today >= liveDate

  return (
    <HeaderObserver color={theme} pullUp>
      <ThemeProvider theme="dark">
        <div className={classes.livestreamHero}>
          <div className={classes.bgWrapper}>
            <Gutter disableMobile className={classes.bgGutter}>
              <div className={classes.bg1}>
                <div className={classes.pixelBG}>
                  <PixelBackground />
                </div>
              </div>
            </Gutter>
          </div>
          <div className={classes.bg2Wrapper}>
            <Gutter className={classes.bgGutter}>
              <Grid className={classes.bg2Grid}>
                <Cell start={7} cols={6} startM={2} colsM={7} className={classes.bg2Cell}>
                  <div className={classes.bg2} />
                </Cell>
              </Grid>
            </Gutter>
          </div>
          <Gutter className={classes.gutter}>
            <Grid>
              <Cell cols={6} colsM={8} startM={1}>
                {breadcrumbs && !hideBreadcrumbs && <Breadcrumbs items={breadcrumbs} />}
                {richText && <RichText content={richText} />}
                {guests &&
                  Array.isArray(guests) &&
                  guests.map(({ name, link, image }, i) => {
                    return (
                      <a className={classes.guestWrap} key={i} href={link || '/'} target="_blank">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {image && <img src={`${process.env.NEXT_PUBLIC_CMS_URL}${image.url}`} />}
                        {name && name}
                      </a>
                    )
                  })}
              </Cell>
              {!isLive && (
                <Cell cols={6} start={8} colsM={8} startM={1} className={classes.linkCell}>
                  <div className={classes.linksWrap}>
                    {date && <label>Starting {formatDate({ date, format: 'dateAndTime' })}</label>}
                    &nbsp;
                    {Array.isArray(links) &&
                      links.map(({ link }, i) => {
                        const { appearance, url, label } = link
                        return (
                          <Button
                            key={i}
                            appearance={appearance}
                            className={[classes.link, appearance && classes[`link--${appearance}`]]
                              .filter(Boolean)
                              .join(' ')}
                            disableLineBlip
                            el="a"
                            href={url}
                            icon="arrow"
                            label={label}
                          />
                        )
                      })}
                  </div>
                </Cell>
              )}
              {isLive && youtubeID && (
                <Cell cols={6} start={8} colsM={8} startM={1} className={classes.videoCell}>
                  <div className={classes.videoWrap}>
                    <label>Watch the stream</label>
                    &nbsp;
                    <Video platform="youtube" id={youtubeID} />
                    <Button
                      className={[classes.link, classes[`link--default`]].join(' ')}
                      el="a"
                      href={`https://www.youtube.com/watch?v=${youtubeID}`}
                      label="Go watch on youtube"
                      icon="arrow"
                      disableLineBlip
                    />
                  </div>
                </Cell>
              )}
            </Grid>
          </Gutter>
        </div>
      </ThemeProvider>
    </HeaderObserver>
  )
}
