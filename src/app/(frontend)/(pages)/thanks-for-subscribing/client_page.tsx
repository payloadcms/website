'use client'

import { Button } from '@components/Button/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { LargeBody } from '@components/LargeBody/index.js'

export const ThanksForSubscribingPage = () => {
  return (
    <Gutter>
      <div className={['grid'].filter(Boolean).join(' ')}>
        <div className={['cols-12'].filter(Boolean).join(' ')}>
          <h1>Subscribed</h1>
          <LargeBody>
            Thank you for subscribing. You will now receive regular Payload updates to your email.
          </LargeBody>
          <br />
          <Button appearance="secondary" el="link" href="/" label="Back Home" />
        </div>
      </div>
    </Gutter>
  )
}
