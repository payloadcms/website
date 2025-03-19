'use client'

import { Button } from '@components/Button/index'
import { usePrivacy } from '@root/providers/Privacy/index'
import Link from 'next/link'
import * as React from 'react'

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
          We use cookies, subject to your consent, to analyze the use of our website and to ensure
          you get the best experience. Third parties with whom we collaborate can also install
          cookies in order to show you personalized advertisements on other websites. Read our{' '}
          <Link className={classes.privacyLink} href="/cookie" prefetch={false}>
            cookie policy
          </Link>{' '}
          for more information.
        </p>
        <div className={classes.buttonWrap}>
          <Button
            appearance="secondary"
            className={classes.rejectButton}
            label="Dismiss"
            onClick={() => {
              updateCookieConsent(false)
              handleCloseBanner()
            }}
          />
          <Button
            appearance="primary"
            className={classes.acceptButton}
            label="Accept"
            onClick={() => {
              updateCookieConsent(true)
              handleCloseBanner()
            }}
          />
        </div>
      </div>
    </div>
  )
}
