'use client'

import * as React from 'react'
import { CollapsibleGroup } from '@faceless-ui/collapsibles'

import { Accordion } from '@root/app/_components/Accordion'
import { MaxWidth } from '@root/app/_components/MaxWidth'
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
        <Accordion label="New Domain" openOnInit>
          <AddDomain />
        </Accordion>
      </CollapsibleGroup>

      {project?.domains && project.domains.length > 0 ? (
        <React.Fragment>
          <Divider />
          <SectionHeader title="Manage Domains" />
          <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
            <div>
              {project.domains.map(domain => (
                <ManageDomain key={domain.id} domain={domain} />
              ))}
            </div>
          </CollapsibleGroup>
        </React.Fragment>
      ) : (
        <NoData message="This project currently has no custom domains configured." />
      )}
    </MaxWidth>
  )
}
