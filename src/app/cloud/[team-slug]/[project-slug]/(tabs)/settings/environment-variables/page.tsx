'use client'

import * as React from 'react'
import { Collapsible, CollapsibleGroup } from '@faceless-ui/collapsibles'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { useRouteData } from '@root/app/cloud/context'
import { Accordion } from './_components/Accordion'
import { AddEnvs } from './_components/AddEnvs'
import { ManageEnv } from './_components/ManageEnv'

import classes from './index.module.scss'

export default () => {
  const { project } = useRouteData()

  return (
    <div className={classes.envVariables}>
      <div className={classes.sectionHeader}>
        <Heading element="h2" as="h5" marginTop={false}>
          Environment Variables
        </Heading>
        <Button label="learn more" icon="arrow" el="link" href="/" />
      </div>

      <CollapsibleGroup transTime={250} transCurve="ease">
        <Collapsible openOnInit>
          <Accordion label="New variables" toggleIcon="chevron" className={classes.addNewEnvs}>
            <AddEnvs />
          </Accordion>
        </Collapsible>
      </CollapsibleGroup>

      <hr className={classes.divider} />

      {(project.environmentVariables || []).length === 0 ? (
        <p className={classes.noEnvs}>This project currently has no environment variables.</p>
      ) : (
        <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
          <div className={classes.collapsibleGroup}>
            {project.environmentVariables.map(({ key, id }, i) => (
              <ManageEnv key={id || i} index={i} envKey={key} arrayItemID={id} />
            ))}
          </div>
        </CollapsibleGroup>
      )}
    </div>
  )
}
