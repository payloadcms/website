import * as React from 'react'
import Link from 'next/link'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'

import classes from './index.module.scss'

export const PrivacyBanner: React.FC<{ accept: () => void }> = ({
  accept,
}: {
  accept: () => void
}) => {
  const [closeBanner, setCloseBanner] = React.useState(false)
  const [animateOut, setAnimateOut] = React.useState(false)

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

  if (closeBanner) {
    return null
  }

  return (
    <Gutter
      className={[classes.privacyBanner, animateOut && classes.animateOut]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={classes.contentWrap}>
        <p className={classes.content}>
          {`We use `}
          <Link href="/privacy" className={classes.privacyLink}>
            cookies
          </Link>
          {' so we can build a better product.'}
        </p>
        <div className={classes.buttonWrap}>
          <Button
            appearance="secondary"
            label="REJECT ALL"
            className={classes.rejectButton}
            onClick={handleCloseBanner}
          />
          <Button
            appearance="secondary"
            label="ACCEPT ALL"
            className={classes.acceptButton}
            onClick={() => {
              accept()
              handleCloseBanner()
            }}
          />
        </div>
      </div>
    </Gutter>
  )
}
