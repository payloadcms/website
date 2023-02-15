import * as React from 'react'
import { fetchTeamProjectBySlug } from '@rsc-api/cloud'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { HeaderTabs } from './_components/HeaderTabs'
import { ProjectProvider } from './context'

import classes from './index.module.scss'

type ProjectLayoutType = {
  children: React.ReactNode
  params: {
    'project-slug': string
    'team-slug': string
  }
}

const ProjectLayout = async ({ children, params }: ProjectLayoutType) => {
  const { 'project-slug': projectSlug, 'team-slug': teamSlug } = params
  const project = await fetchTeamProjectBySlug({ projectSlug, teamSlug })

  const parentPath = `/dashboard/${teamSlug}`
  const currentPath = `${parentPath}/${projectSlug}`

  return (
    <React.Fragment>
      <ProjectProvider project={project}>
        <Gutter className={classes.tabContainer}>
          <Breadcrumbs
            items={[
              {
                label: 'Projects',
                url: `${parentPath}/projects`,
              },
              {
                label: project.name,
                url: currentPath,
              },
            ]}
          />
          <HeaderTabs parentPath={currentPath} />
        </Gutter>

        <Gutter>{children}</Gutter>
      </ProjectProvider>
    </React.Fragment>
  )
}

export default ProjectLayout
