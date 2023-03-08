'use client'

import * as React from 'react'
import { Collapsible, CollapsibleGroup } from '@faceless-ui/collapsibles'

import { Accordion } from '@dashboard/_components/Accordion'
import { Divider } from '@dashboard/_components/SectionDivider'
import { Project } from '@root/payload-cloud-types'
import { NoData } from '../_layoutComponents/NoData'
import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { AddDomain } from './_components/AddDomain'
import { ManageDomain } from './_components/ManageDomain'

import classes from './index.module.scss'

const mockDomains: Project['domains'] = [
  {
    id: '1',
    domain: 'active.com',
    status: 'active',
    records: [
      {
        type: 'CNAME',
        name: '@',
        value: '58.58.58.58',
      },
      {
        type: 'A',
        name: '@',
        value: '58.58.58.58',
      },
    ],
  },
  {
    id: '2',
    domain: 'pending.com',
    status: 'pending',
    records: [
      {
        type: 'A',
        name: '@',
        value: '58.58.58.58',
      },
    ],
  },
]

export default () => {
  const domains = mockDomains // will come from project

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

      {domains.length > 0 ? (
        <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
          <div className={classes.collapsibleGroup}>
            {domains.map(domain => (
              <ManageDomain key={domain.id} domain={domain} />
            ))}
          </div>
        </CollapsibleGroup>
      ) : (
        <NoData message="This project currently has no configured domains." />
      )}
    </div>
  )
}
