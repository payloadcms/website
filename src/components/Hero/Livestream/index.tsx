'use client'

import * as React from 'react'
import { formatDate } from '@utilities/format-date-time.js'

import { Breadcrumbs } from '@components/Breadcrumbs/index.js'
import { Button } from '@components/Button/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { RichText } from '@components/RichText/index.js'
import { Video } from '@components/RichText/Video/index.js'
import { Page } from '@root/payload-types.js'

import classes from './index.module.scss'

export const LivestreamHero: React.FC<{
  livestream: NonNullable<Page['hero']['livestream']>
  breadcrumbs?: Page['breadcrumbs']
  links?: Page['hero']['links']
}> = props => {
  const {
    breadcrumbs,
    livestream: { id: youtubeID = '', hideBreadcrumbs, date, guests, richText },
    links,
  } = props

  const today = new Date()
  const liveDate = new Date(date)
  const isLive = today >= liveDate

  return (
    <div data-theme="dark">
      <div className={classes.livestreamHero}>
        <div className={classes.bgWrapper}>
          <Gutter disableMobile className={classes.bgGutter}>
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
                <Breadcrumbs items={breadcrumbs} ellipsis={false} />
              )}
              {richText && <RichText content={richText} />}
              {guests &&
                Array.isArray(guests) &&
                guests.map(({ name, link, image }, i) => {
                  return (
                    <a className={classes.guestWrap} key={i} href={link || '/'} target="_blank">
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
                      const { appearance, url, label } = link || {}
                      return (
                        <Button
                          key={i}
                          appearance={appearance}
                          className={[classes.link, appearance && classes[`link--${appearance}`]]
                            .filter(Boolean)
                            .join(' ')}
                          el="a"
                          href={url}
                          icon="arrow"
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
                  <Video platform="youtube" id={youtubeID} />
                  <Button
                    className={[classes.link, classes[`link--default`]].join(' ')}
                    el="a"
                    href={`https://www.youtube.com/watch?v=${youtubeID}`}
                    label="Go watch on youtube"
                    icon="arrow"
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
