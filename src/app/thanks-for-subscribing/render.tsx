'use client'

import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { HeaderObserver } from '@components/HeaderObserver'
import { LargeBody } from '@components/LargeBody'
import { useTheme } from '@root/providers/Theme'

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
