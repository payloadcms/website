'use client'

import * as React from 'react'
import { CollapsibleGroup } from '@faceless-ui/collapsibles'

import { Accordion } from '@root/app/_components/Accordion'
import { HR } from '@root/app/_components/HR'
import { MaxWidth } from '@root/app/_components/MaxWidth'
import { Project, Team } from '@root/payload-cloud-types'
import { NoData } from '../_layoutComponents/NoData'
import { SectionHeader } from '../_layoutComponents/SectionHeader'
import { AddDomain } from './AddDomain'
import { ManageDomain } from './ManageDomain'

export const ProjectDomainsPage: React.FC<{
  project: Project
  team: Team
}> = ({ project, team }) => {
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
          <AddDomain project={project} team={team} />
        </Accordion>
      </CollapsibleGroup>
      {project?.domains && project.domains.length > 0 ? (
        <React.Fragment>
          <HR />
          <SectionHeader title="Manage Domains" />
          <CollapsibleGroup transTime={250} transCurve="ease" allowMultiple>
            <div>
              {project.domains.map(domain => (
                <ManageDomain key={domain.id} domain={domain} project={project} team={team} />
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
