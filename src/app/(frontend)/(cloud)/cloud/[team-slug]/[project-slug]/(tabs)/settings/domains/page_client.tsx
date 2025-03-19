'use client'

import type { Project, Team } from '@root/payload-cloud-types'

import { Accordion } from '@components/Accordion/index'
import { HR } from '@components/HR/index'
import { MaxWidth } from '@components/MaxWidth/index'
import { CollapsibleGroup } from '@faceless-ui/collapsibles'
import * as React from 'react'

import { NoData } from '../_layoutComponents/NoData/index'
import { SectionHeader } from '../_layoutComponents/SectionHeader/index'
import { AddDomain } from './AddDomain/index'
import { ManageDomain } from './ManageDomain/index'

export const ProjectDomainsPage: React.FC<{
  environmentSlug: string
  project: Project
  team: Team
}> = ({ environmentSlug, project, team }) => {
  return (
    <MaxWidth>
      <SectionHeader
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
        title="Custom Domains"
      />
      <CollapsibleGroup transCurve="ease" transTime={250}>
        <Accordion label="New Domain" openOnInit>
          <AddDomain environmentSlug={environmentSlug} project={project} team={team} />
        </Accordion>
      </CollapsibleGroup>
      <HR />
      {project?.domains && project.domains.length > 0 ? (
        <React.Fragment>
          <SectionHeader title="Manage Domains" />
          <CollapsibleGroup allowMultiple transCurve="ease" transTime={250}>
            <div>
              {project.domains.map((domain) => (
                <ManageDomain
                  domain={domain}
                  environmentSlug={environmentSlug}
                  key={domain.id}
                  project={project}
                  team={team}
                />
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
