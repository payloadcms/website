'use client'

import * as React from 'react'
import { Collapsible, CollapsibleGroup } from '@faceless-ui/collapsibles'

import { Accordion } from '@root/app/cloud/_components/Accordion'
import { Divider } from '@root/app/cloud/_components/SectionDivider'
import { useRouteData } from '@root/app/cloud/context'
import { NoData } from '../_layoutComponents/NoData'
import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { AddEnvs } from './_components/AddEnvs'
import { ManageEnv } from './_components/ManageEnv'

import classes from './index.module.scss'

export default () => {
  const { project } = useRouteData()

  return (
    <div className={classes.envVariables}>
      <SectionHeader title="Environment Variables" />

      <CollapsibleGroup transTime={250} transCurve="ease">
        <Collapsible openOnInit>
          <Accordion label="New variables" toggleIcon="chevron" className={classes.addNewEnvs}>
            <AddEnvs />
          </Accordion>
        </Collapsible>
      </CollapsibleGroup>

      <Divider />

      {(project.environmentVariables || []).length === 0 ? (
        <NoData message="This project currently has no environment variables." />
      ) : (
        <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
          <div className={classes.collapsibleGroup}>
            {project?.environmentVariables?.map(env => (
              <ManageEnv key={env.id} env={env} />
            ))}
          </div>
        </CollapsibleGroup>
      )}
    </div>
  )
}
