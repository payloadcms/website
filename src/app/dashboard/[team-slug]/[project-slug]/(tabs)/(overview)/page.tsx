'use client'

import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Button } from '@components/Button'
import { Label } from '@components/Label'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'
import { BranchIcon } from '@root/graphics/BranchIcon'
import { CommitIcon } from '@root/graphics/CommitIcon'
import { useRouteData } from '../../../../context'

import classes from './page.module.scss'

export default () => {
  const { project } = useRouteData()
  const [status, setStatus] = React.useState('offline')

  return (
    <div>
      <ExtendedBackground className={classes.background}>
        <Grid>
          <Cell start={0} cols={4}>
            <Label>Deployment URL</Label>
            <p>alijweaefa.cloud.payloadcms.com</p>
          </Cell>

          <Cell start={5} cols={3}>
            <Label>Deployed At</Label>
            <p>January 24nd, 2023 4:20pm</p>
          </Cell>

          <Cell start={9} cols={4}>
            <Label>Status</Label>
            <div>
              <div
                className={[classes.statusIndicator, classes[`status--${status}`]]
                  .filter(Boolean)
                  .join(' ')}
              />
              <p>Offline</p>
            </div>
          </Cell>
        </Grid>
      </ExtendedBackground>

      <ExtendedBackground size="l" className={classes.pixels}>
        <ExtendedBackground className={classes.lowerBackground}>
          <Button
            onClick={() => {
              console.log('redeploy')
            }}
            label="Trigger Redeploy"
            appearance="secondary"
          />

          <div className={classes.deployDetails}>
            <div className={classes.iconAndLabel}>
              <BranchIcon />
              <p>main</p>
            </div>
            <div className={classes.iconAndLabel}>
              <CommitIcon />
              <p>32rf343: some message</p>
            </div>
          </div>
        </ExtendedBackground>
      </ExtendedBackground>
    </div>
  )
}
