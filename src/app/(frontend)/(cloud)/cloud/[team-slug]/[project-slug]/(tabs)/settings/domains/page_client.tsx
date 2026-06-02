'use client'

import type { Project, Team } from '@root/payload-cloud-types'

import { Accordion } from '@components/Accordion/index'
import { HR } from '@components/HR/index'
import { MaxWidth } from '@components/MaxWidth/index'
import { CollapsibleGroup } from '@faceless-ui/collapsibles'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants'
import * as React from 'react'

import { NoData } from '../_layoutComponents/NoData/index'
import { SectionHeader } from '../_layoutComponents/SectionHeader/index'
import { AddDomain } from './AddDomain/index'
import { ManageDomain } from './ManageDomain/index'

// Mirror the write endpoint's scoping: prod writes to project.domains, env writes to environments[].domains.
const selectScopedDomains = (
  project: Project,
  environmentSlug: string,
): NonNullable<Project['domains']> => {
  if (environmentSlug === PRODUCTION_ENVIRONMENT_SLUG) {
    return project.domains || []
  }
  return project.environments?.find((env) => env.environmentSlug === environmentSlug)?.domains || []
}

export const ProjectDomainsPage: React.FC<{
  environmentSlug: string
  project: Project
  team: Team
}> = ({ environmentSlug, project, team }) => {
  const scopedDomains = React.useMemo(
    () => selectScopedDomains(project, environmentSlug),
    [project, environmentSlug],
  )

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
          <AddDomain
            environmentSlug={environmentSlug}
            project={project}
            scopedDomains={scopedDomains}
            team={team}
          />
        </Accordion>
      </CollapsibleGroup>
      <HR />
      {scopedDomains.length > 0 ? (
        <React.Fragment>
          <SectionHeader title="Manage Domains" />
          <CollapsibleGroup allowMultiple transCurve="ease" transTime={250}>
            <div>
              {scopedDomains.map((domain) => (
                <ManageDomain
                  domain={domain}
                  environmentSlug={environmentSlug}
                  key={domain.id}
                  project={project}
                  scopedDomains={scopedDomains}
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
