'use client'

import * as React from 'react'
import Link from 'next/link'

import { Button } from '@components/Button'
import { usePrivacy } from '@root/providers/Privacy'

import classes from './index.module.scss'

export const PrivacyBanner: React.FC = () => {
  const [closeBanner, setCloseBanner] = React.useState(false)
  const [animateOut, setAnimateOut] = React.useState(false)

  const { showConsent, updateCookieConsent } = usePrivacy()

  const handleCloseBanner = () => {
    setAnimateOut(true)
  }

  React.useEffect(() => {
    if (animateOut) {
      setTimeout(() => {
        setCloseBanner(true)
      }, 300)
    }
  }, [animateOut])

  if (!showConsent || closeBanner) {
    return null
  }

  return (
    <div
      className={[classes.privacyBanner, animateOut && classes.animateOut]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.contentWrap}>
        <p className={classes.content}>
          {`We use `}
          <Link href="/privacy#cookies" className={classes.privacyLink}>
            cookies
          </Link>
          {' so we can build a better product.'}
        </p>
        <div className={classes.buttonWrap}>
          <Button
            appearance="secondary"
            label="Dismiss"
            className={classes.rejectButton}
            onClick={() => {
              updateCookieConsent(false, true)
              handleCloseBanner()
            }}
          />
          <Button
            appearance="primary"
            label="Accept"
            className={classes.acceptButton}
            onClick={() => {
              updateCookieConsent(true, false)
              handleCloseBanner()
            }}
          />
        </div>
      </div>
    </div>
  )
}
