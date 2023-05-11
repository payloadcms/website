'use client'

import * as React from 'react'
import { Collapsible, CollapsibleGroup } from '@faceless-ui/collapsibles'
import Link from 'next/link'

import { MaxWidth } from '@root/app/_components/MaxWidth'
import { Accordion } from '@root/app/cloud/_components/Accordion'
import { Divider } from '@root/app/cloud/_components/SectionDivider'
import { useRouteData } from '@root/app/cloud/context'
import { NoData } from '../_layoutComponents/NoData'
import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { AddEnvs } from './_components/AddEnvs'
import { ManageEnv } from './_components/ManageEnv'
import { Secret } from './Secret'

import classes from './index.module.scss'

export const ProjectEnvPage = () => {
  const { project } = useRouteData()

  return (
    <MaxWidth>
      <SectionHeader title="Environment Variables" className={classes.header} />
      <div className={classes.description}>
        Environmental variables are used to isolate sensitive data from your application. For
        security and safety reasons, any variables you wish to provide to the Admin panel must be
        prefixed with <code>PAYLOAD_PUBLIC</code>.{' '}
        <Link href="/docs/admin/webpack#admin-environment-vars" className={classes.link}>
          Learn more.
        </Link>
      </div>
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

      <SectionHeader title="Payload Secret" className={classes.header} />
      <div className={classes.description}>
        This is a secure string used to authenticate with Payload. It was automatically generated
        for you when this project was created.{' '}
        <Link href="/docs/getting-started/installation#doc" className={classes.link}>
          Learn more.
        </Link>
      </div>
      <Secret />
    </MaxWidth>
  )
}
