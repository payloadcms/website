'use client'

import type { Page } from '@root/payload-types'

import { Breadcrumbs } from '@components/Breadcrumbs/index'
import { Button } from '@components/Button/index'
import { Gutter } from '@components/Gutter/index'
import { RichText } from '@components/RichText/index'
import { Video } from '@components/RichText/Video/index'
import { formatDate } from '@utilities/format-date-time'
import * as React from 'react'

import classes from './index.module.scss'

export const LivestreamHero: React.FC<{
  breadcrumbs?: Page['breadcrumbs']
  links?: Page['hero']['links']
  livestream: NonNullable<Page['hero']['livestream']>
}> = (props) => {
  const {
    breadcrumbs,
    links,
    livestream: { id: youtubeID = '', date, guests, hideBreadcrumbs, richText },
  } = props

  const today = new Date()
  const liveDate = new Date(date)
  const isLive = today >= liveDate

  return (
    <div data-theme="dark">
      <div className={classes.livestreamHero}>
        <div className={classes.bgWrapper}>
          <Gutter className={classes.bgGutter} disableMobile>
            <div className={classes.bg1}></div>
          </Gutter>
        </div>
        <div className={classes.bg2Wrapper}>
          <Gutter className={classes.bgGutter}>
            <div className={[classes.bg2Grid, 'grid'].filter(Boolean).join(' ')}>
              <div
                className={[classes.bg2Cell, 'cols-8 start-10 cols-m-7 start-m-2']
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={classes.bg2} />
              </div>
            </div>
          </Gutter>
        </div>
        <Gutter className={classes.gutter}>
          <div className={['grid'].filter(Boolean).join(' ')}>
            <div className={['cols-8 cols-m-8 start-m-1'].filter(Boolean).join(' ')}>
              {breadcrumbs && !hideBreadcrumbs && (
                <Breadcrumbs ellipsis={false} items={breadcrumbs} />
              )}
              {richText && <RichText content={richText} />}
              {guests &&
                Array.isArray(guests) &&
                guests.map(({ name, image, link }, i) => {
                  return (
                    <a className={classes.guestWrap} href={link || '/'} key={i} target="_blank">
                      {image && typeof image !== 'string' && (
                        <img src={`${process.env.NEXT_PUBLIC_CMS_URL}${image.url}`} />
                      )}
                      {name && name}
                    </a>
                  )
                })}
            </div>
            {!isLive && (
              <div
                className={[classes.linkCell, 'cols-8 start-10 cols-m-8 start-m-1']
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={classes.linksWrap}>
                  {date && <label>Starting {formatDate({ date, format: 'dateAndTime' })}</label>}
                  &nbsp;
                  {Array.isArray(links) &&
                    links.map(({ link }, i) => {
                      const { appearance, label, url } = link || {}
                      return (
                        <Button
                          appearance={appearance}
                          className={[classes.link, appearance && classes[`link--${appearance}`]]
                            .filter(Boolean)
                            .join(' ')}
                          el="a"
                          href={url}
                          icon="arrow"
                          key={i}
                          label={label}
                        />
                      )
                    })}
                </div>
              </div>
            )}
            {isLive && youtubeID && (
              <div
                className={[classes.videoCell, 'cols-8 start-10 cols-m-8 start-m-1']
                  .filter(Boolean)
                  .join(' ')}
              >
                <div className={classes.videoWrap}>
                  <Video id={youtubeID} platform="youtube" />
                  <Button
                    className={[classes.link, classes[`link--default`]].join(' ')}
                    el="a"
                    href={`https://www.youtube.com/watch?v=${youtubeID}`}
                    icon="arrow"
                    label="Go watch on youtube"
                  />
                </div>
              </div>
            )}
          </div>
        </Gutter>
      </div>
    </div>
  )
}
