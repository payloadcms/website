import React from 'react'

import { Button } from '@components/Button'
import { LineDraw } from '@components/LineDraw'
import { BranchIcon } from '@root/graphics/BranchIcon'
import { GitHubIcon } from '@root/graphics/GitHub'
import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'

export const ProjectRow: React.FC<{
  project: Project
}> = props => {
  const { project } = props
  const [isHovered, setIsHovered] = React.useState<boolean>(false)

  const { team, status, deploymentBranch, repositoryName } = project

  const teamSlug = typeof team === 'string' ? team : team.slug

  return (
    <div
      className={classes.project}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h6 className={classes.title}>
        {project.name}
        {/* {status === 'draft' && <span className={classes.draft}>&nbsp;(Draft)</span>} */}
        <div className={classes.details}>
          {repositoryName && (
            <div className={classes.projectRepo}>
              <GitHubIcon className={classes.githubIcon} />
              {repositoryName}
            </div>
          )}
          {deploymentBranch && (
            <div className={classes.projectBranch}>
              <BranchIcon className={classes.branchIcon} />
              {deploymentBranch}
            </div>
          )}
        </div>
      </h6>
      <Button
        appearance="primary"
        label={status === 'draft' ? 'Setup' : 'View'}
        size="small"
        href={
          status === 'draft'
            ? `/new/configure/${project.id}`
            : `/dashboard/${teamSlug}/${project.slug}`
        }
        el="link"
      />
      <LineDraw align="bottom" active={isHovered} />
    </div>
  )
}
