'use client'

import * as React from 'react'
import { useCookies } from 'react-cookie'
import { usePathname } from 'next/navigation.js'

import { RichText } from '@components/RichText/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import { CloseIcon } from '@root/icons/CloseIcon/index.js'
import type { Announcement } from '../../payload-types.js'

import classes from './index.module.scss'

export const Announcements: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => {
  const [closeAnnouncement, setCloseAnnouncement] = React.useState(false)
  const [cookies, setCookie] = useCookies()
  const pathname = usePathname()
  const onDocsPage = pathname?.startsWith('/docs')
  const [showAnnouncement, setShowAnnouncement] = React.useState(false)

  React.useEffect(() => {
    const newShow = !closeAnnouncement && !cookies.dismissAnnouncement
    setShowAnnouncement(newShow)
  }, [closeAnnouncement, cookies.dismissAnnouncement])

  return (
    <div
      className={[classes.announcementWrap, onDocsPage && classes.onDocsPage]
        .filter(Boolean)
        .join(' ')}
    >
      {showAnnouncement &&
        announcements.map((announcement, index) => {
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
