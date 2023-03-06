'use client'

import * as React from 'react'
import { RichText } from '@components/RichText'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { CloseIcon } from '@root/graphics/CloseIcon'
import { useCookies } from 'react-cookie'
import { usePathname } from 'next/navigation'
import type { Announcement } from '../../payload-types'

import classes from './index.module.scss'

export const Announcements: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => {
  const [closeAnnouncement, setCloseAnnouncement] = React.useState(false)
  const [cookies, setCookie] = useCookies()
  const pathname = usePathname()
  const onDocsPage = pathname.startsWith('/docs')

  const showAnnouncement = !closeAnnouncement && !cookies.dismissAnnouncement

  return (
    <div
      className={[classes.announcementWrap, onDocsPage && classes.onDocsPage]
        .filter(Boolean)
        .join(' ')}
    >
      {showAnnouncement &&
        announcements.map(announcement => {
          const { content } = announcement

          return (
            <div className={classes.announcement}>
              <div className={classes.richText}>
                <RichText content={content} />
                <ArrowIcon className={classes.arrow} />
              </div>
              <button
                onClick={() => {
                  setCloseAnnouncement(true)
                  setCookie('dismissAnnouncement', true, { maxAge: 34560000 }) // 400 days (max allowed by cookie)
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
