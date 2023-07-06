'use client'

import { Gutter } from '@components/Gutter'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { ExtendedBackground } from '@root/app/_components/ExtendedBackground'
import { DeploymentList } from './_components/DeploymentList'
import { Banner } from '@components/Banner'
import { DropdownMenu } from '@components/DropdownMenu'
import { Label } from '@components/Label'
import { Button } from '@components/Button'

export const ProjectDeploymentsPage = () => {
  return (
    <Gutter>
      <Grid>
        <Cell start={1} colsXL={12} colsL={12}>
          <ExtendedBackground
            pixels
            upperChildren={
              <Grid>
                <Cell start={1} colsS={8} colsXL={6}>
                  <h4>Deployment History</h4>
                </Cell>
                <Cell start={7} startS={1} colsS={8} colsXL={6}>
                  <Button appearance="secondary" label="Date" />
                  <Button appearance="secondary" label="Status" />
                </Cell>
                <Cell start={1} colsS={8} colsXL={12}>
                  <DeploymentList />
                </Cell>
              </Grid>
            }
          />
        </Cell>
      </Grid>
    </Gutter>
  )
}
