'use client'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { LargeBody } from '@components/LargeBody'

export const ThanksForSubscribingPage = () => {
  return (
    <Gutter>
      <div className={['grid top-margin'].filter(Boolean).join(' ')}>
        <div className={['cols-8'].filter(Boolean).join(' ')}>
          <h1>Subscribed</h1>
          <LargeBody>
            Thank you for subscribing. You will now receive regular Payload updates to your email.
          </LargeBody>
          <br />
          <Button href="/" el="link" label="Back Home" appearance="secondary" />
        </div>
      </div>
    </Gutter>
  )
}
