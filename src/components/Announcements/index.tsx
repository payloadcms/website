'use client'

import * as React from 'react'
import { useCookies } from 'react-cookie'

import { RichText } from '@components/RichText'
import { CloseIcon } from '@root/graphics/CloseIcon'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import type { Announcement } from '../../payload-types'

import classes from './index.module.scss'

export const Announcements: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => {
  const [closeAnnouncement, setCloseAnnouncement] = React.useState(false)
  const [cookies, setCookie] = useCookies()

  const showAnnouncement =
    announcements.length > 0 && !closeAnnouncement && cookies.dismissAnnouncement !== 'true'

  if (!showAnnouncement) return null

  return (
    <div className={classes.announcementWrap}>
      {announcements.map((announcement, index) => {
        const { content } = announcement

        return (
          <div className={classes.announcement} key={index}>
            <div className={classes.richText}>
              <RichText content={content} />
              <ArrowIcon className={classes.arrow} />
            </div>
            <button
              onClick={() => {
                setCloseAnnouncement(true)
                setCookie('dismissAnnouncement', 'true', { maxAge: 86400 }) // Expires after 24 hours
              }}
              className={classes.close}
            >
              <CloseIcon />
            </button>
          </div>
        )
      })}
    </div>
  )
}
