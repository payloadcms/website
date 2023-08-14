'use client'

import * as React from 'react'
import { CollapsibleGroup } from '@faceless-ui/collapsibles'

import { Accordion } from '@root/app/_components/Accordion'
import { HR } from '@root/app/_components/HR'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { Project, Team } from '@root/payload-cloud-types'
import { NoData } from '../_layoutComponents/NoData'
import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { AddEnvs } from './AddEnvs'
import { ManageEnv } from './ManageEnv'
import { Secret } from './Secret'

import classes from './page.module.scss'

export const ProjectEnvPage: React.FC<{
  project: Project
  team: Team
}> = ({ project }) => {
  return (
    <MaxWidth>
      <SectionHeader title="Environment Variables" className={classes.header} />
      <div className={classes.description}>
        {`For security reasons, any variables you wish to provide to the Admin panel must
        be prefixed with `}
        <code>PAYLOAD_PUBLIC_</code>
        {'. '}
        <a
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/docs/admin/webpack#admin-environment-vars`}
          className={classes.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more
        </a>
        {'.'}
      </div>
      <Accordion openOnInit label="New variables">
        <AddEnvs project={project} />
      </Accordion>
      <HR />
      {(project?.environmentVariables || []).length === 0 ? (
        <NoData message="This project currently has no environment variables." />
      ) : (
        <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
          <div>
            {project?.environmentVariables?.map(env => (
              <ManageEnv key={env.id} env={env} project={project} />
            ))}
          </div>
        </CollapsibleGroup>
      )}
      <HR />
      <SectionHeader title="Payload Secret" className={classes.header} />
      <div className={classes.description}>
        {`This is a secure string used to authenticate with Payload. It was automatically generated
        for you when this project was created. `}
        <a
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/docs/getting-started/installation`}
          className={classes.link}
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn more
        </a>
        {'.'}
      </div>
      <Secret project={project} />
    </MaxWidth>
  )
}
