'use client'

import * as React from 'react'
import { Collapsible, CollapsibleGroup } from '@faceless-ui/collapsibles'

import { MaxWidth } from '@root/app/_components/MaxWidth'
import { Accordion } from '@root/app/cloud/_components/Accordion'
import { Divider } from '@root/app/cloud/_components/SectionDivider'
import { useRouteData } from '@root/app/cloud/context'
import { NoData } from '../_layoutComponents/NoData'
import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { AddDomain } from './_components/AddDomain'
import { ManageDomain } from './_components/ManageDomain'

export const ProjectDomainsPage = () => {
  const { project } = useRouteData()

  return (
    <MaxWidth>
      <SectionHeader
        title="Custom Domains"
        intro={
          <>
            {project?.defaultDomain && (
              <p>
                <strong>Default domain: </strong>
                <a href={`https://${project.defaultDomain}`} target="_blank">
                  {project.defaultDomain}
                </a>
              </p>
            )}
          </>
        }
      />

      <CollapsibleGroup transTime={250} transCurve="ease">
        <Collapsible openOnInit>
          <Accordion label="New Domain" toggleIcon="chevron">
            <AddDomain />
          </Accordion>
        </Collapsible>
      </CollapsibleGroup>

      <Divider />

      {project?.domains && project.domains.length > 0 ? (
        <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
          <div>
            {project.domains.map(domain => (
              <ManageDomain key={domain.id} domain={domain} />
            ))}
          </div>
        </CollapsibleGroup>
      ) : (
        <NoData message="This project currently has no custom domains configured." />
      )}
    </MaxWidth>
  )
}
