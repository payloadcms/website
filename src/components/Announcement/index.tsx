'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'
import { RichText } from '@components/RichText'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { CloseIcon } from '@root/graphics/CloseIcon'
import { useCookies } from 'react-cookie'

import classes from './index.module.scss'

export const Announcement: React.FC<{ message?: String }> = ({ message }) => {
  const { oneModalIsOpen } = useModal()
  const [closeAnnouncement, setCloseAnnouncement] = React.useState(false)

  const [cookies, setCookie] = useCookies()

  const showAnnouncement =
    message && !closeAnnouncement && !cookies.dismissAnnouncement && !oneModalIsOpen

  if (showAnnouncement)
    return (
      <div className={classes.announcement}>
        <div className={classes.richText}>
          <RichText content={message} />
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
}
