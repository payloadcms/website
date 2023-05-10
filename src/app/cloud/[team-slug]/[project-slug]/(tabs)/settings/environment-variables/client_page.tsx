'use client'

import * as React from 'react'
import { Collapsible, CollapsibleGroup } from '@faceless-ui/collapsibles'

import { MaxWidth } from '@root/app/_components/MaxWidth'
import { Accordion } from '@root/app/cloud/_components/Accordion'
import { Divider } from '@root/app/cloud/_components/SectionDivider'
import { useRouteData } from '@root/app/cloud/context'
import { NoData } from '../_layoutComponents/NoData'
import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { AddEnvs } from './_components/AddEnvs'
import { ManageEnv } from './_components/ManageEnv'
import { Secret } from './_components/Secret'

export const ProjectEnvPage = () => {
  const { project } = useRouteData()

  return (
    <MaxWidth>
      <SectionHeader title="Environment Variables" />

      <CollapsibleGroup transTime={250} transCurve="ease">
        <Collapsible openOnInit>
          <Accordion label="New variables" toggleIcon="chevron">
            <AddEnvs />
          </Accordion>
        </Collapsible>
      </CollapsibleGroup>

      <Divider />

      {(project?.environmentVariables || []).length === 0 ? (
        <NoData message="This project currently has no environment variables." />
      ) : (
        <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
          <div>
            {project?.environmentVariables?.map(env => (
              <ManageEnv key={env.id} env={env} />
            ))}
          </div>
        </CollapsibleGroup>
      )}

      <Divider />

      <SectionHeader title="Payload Secret" />
      <Secret />
    </MaxWidth>
  )
}
