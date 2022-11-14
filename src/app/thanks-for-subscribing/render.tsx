'use client'

import * as React from 'react'
import { Gutter } from '@components/Gutter'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@root/providers/Theme'
import { LargeBody } from '@components/LargeBody'
import { Button } from '@components/Button'

const RenderPage: React.FC = () => {
  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter>
        <Grid>
          <Cell cols={8}>
            <h1>Subscribed</h1>
            <LargeBody>
              Thank you for subscribing. You will now receive regular Payload updates to your email.
            </LargeBody>
            <br />
            <Button href="/" el="link" label="Back Home" appearance="secondary" />
          </Cell>
        </Grid>
      </Gutter>
    </HeaderObserver>
  )
}

export default RenderPage
