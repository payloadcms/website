'use client'

import * as React from 'react'
import { Accordion } from '@dashboard/_components/Accordion'
import { Collapsible, CollapsibleGroup } from '@faceless-ui/collapsibles'
import { Divider } from '@dashboard/_components/SectionDivider'
import { useRouteData } from '@dashboard/context'

import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { AddDomain } from './_components/AddDomain'

import classes from './index.module.scss'
import { NoData } from '../_layoutComponents/NoData'

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

      <NoData message="This project currently has no configured domains." />
    </div>
  )
}
