'use client'

import * as React from 'react'
import { RichText } from '@components/RichText'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { CloseIcon } from '@root/graphics/CloseIcon'
import { useCookies } from 'react-cookie'

import classes from './index.module.scss'

export const Announcement: React.FC<{ content?: String }> = ({ content }) => {
  const [closeAnnouncement, setCloseAnnouncement] = React.useState(false)
  const [cookies, setCookie] = useCookies()

  const showAnnouncement = content && !closeAnnouncement && !cookies.dismissAnnouncement

  if (showAnnouncement)
    return (
      <div className={classes.announcement}>
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
  return null
}
