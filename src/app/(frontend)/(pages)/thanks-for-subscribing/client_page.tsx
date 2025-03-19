'use client'

import { Button } from '@components/Button/index'
import { Gutter } from '@components/Gutter/index'
import { LargeBody } from '@components/LargeBody/index'

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
