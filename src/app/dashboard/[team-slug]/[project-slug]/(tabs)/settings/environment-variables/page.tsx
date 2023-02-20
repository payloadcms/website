'use client'

import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Secret } from '@forms/fields/Secret'
import { Text } from '@forms/fields/Text'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'

export default () => {
  const fetchEnv = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/me`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const json = await response.json()

    return json.user.id
  }

  return (
    <div>
      <div>
        <Heading element="h2" as="h4" marginTop={false}>
          Environment Variables
        </Heading>
        <Button label="learn more" icon="arrow" el="link" href="/" />
      </div>

      <div>
        <Grid>
          <Cell cols={4}>
            <Text label="Name" />
          </Cell>
          <Cell start={5} cols={4}>
            <Secret loadSecret={fetchEnv} label="Value" />
          </Cell>
        </Grid>
      </div>

      <div>Add Another</div>

      <div>Update</div>
    </div>
  )
}
