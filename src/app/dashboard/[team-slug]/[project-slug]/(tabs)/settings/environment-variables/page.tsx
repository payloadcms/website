'use client'

import * as React from 'react'
import { Collapsible, CollapsibleGroup } from '@faceless-ui/collapsibles'

import { Button } from '@components/Button'
import { Heading } from '@components/Heading'
import { useRouteData } from '@root/app/dashboard/context'
import { Accordion } from './_components/Accordion'
import { AddEnvs } from './_components/AddEnvs'
import { RevealEnv } from './_components/RevealEnv'

import classes from './index.module.scss'

export default () => {
  const { project } = useRouteData()

  return (
    <div className={classes.envVariables}>
      <div className={classes.sectionHeader}>
        <Heading element="h2" as="h4" marginTop={false}>
          Environment Variables
        </Heading>
        <Button label="learn more" icon="arrow" el="link" href="/" />
      </div>

      <CollapsibleGroup transTime={250} transCurve="ease">
        <Collapsible openOnInit>
          <div className={`${classes.collapsibleGroup} ${classes.addNewEnvs}`}>
            <Accordion.Header
              label="New variables"
              icon="chevron"
              className={classes.accordionHeader}
            />
            <Accordion.Content>
              <AddEnvs />
            </Accordion.Content>
          </div>
        </Collapsible>
      </CollapsibleGroup>

      <h6>Existing Variables</h6>
      <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
        <div className={classes.collapsibleGroup}>
          {(project.environmentVariables || []).map(({ name, id }, i) => (
            <RevealEnv key={id || i} index={i} name={name} arrayItemID={id} />
          ))}
        </div>
      </CollapsibleGroup>
    </div>
  )
}
