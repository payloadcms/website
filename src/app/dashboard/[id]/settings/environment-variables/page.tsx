'use client'

import * as React from 'react'

import { Heading } from '@components/Heading'
import { Text } from '@forms/fields/Text'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Button } from '@components/Button'

const ProjectEnvPage = () => {
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
            <Text label="Value" />
          </Cell>
        </Grid>
      </div>

      <div>Add Another</div>

      <div>Update</div>
    </div>
  )
}

export default ProjectEnvPage
