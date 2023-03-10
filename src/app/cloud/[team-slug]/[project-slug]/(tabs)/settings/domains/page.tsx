'use client'

import * as React from 'react'
import { Collapsible, CollapsibleGroup } from '@faceless-ui/collapsibles'

import { Accordion } from '@cloud/_components/Accordion'
import { Divider } from '@cloud/_components/SectionDivider'
import { useRouteData } from '@cloud/context'
import { NoData } from '../_layoutComponents/NoData'
import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { AddDomain } from './_components/AddDomain'
import { ManageDomain } from './_components/ManageDomain'

import classes from './index.module.scss'

export default () => {
  const { project } = useRouteData()

  return (
    <div>
      <SectionHeader title="Domains" />

      <CollapsibleGroup transTime={250} transCurve="ease">
        <Collapsible openOnInit>
          <Accordion label="New Domain" toggleIcon="chevron" className={classes.addDomain}>
            <AddDomain />
          </Accordion>
        </Collapsible>
      </CollapsibleGroup>

      <Divider />

      {project.domains.length > 0 ? (
        <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
          <div className={classes.collapsibleGroup}>
            {project.domains.map(domain => (
              <ManageDomain key={domain.id} domain={domain} cnameRecord={project.cnameRecord} />
            ))}
          </div>
        </CollapsibleGroup>
      ) : (
        <NoData message="This project currently has no configured domains." />
      )}
    </div>
  )
}
