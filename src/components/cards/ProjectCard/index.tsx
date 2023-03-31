import React, { Fragment } from 'react'
import Link from 'next/link'

import { cloudSlug } from '@root/app/cloud/layout'
import { BranchIcon } from '@root/graphics/BranchIcon'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { Project } from '@root/payload-cloud-types'

import classes from './index.module.scss'

export const ProjectCard: React.FC<{
  project: Project
  className?: string
}> = props => {
  const { project, className } = props

  const { team, status, deploymentBranch, repositoryFullName } = project

  const teamSlug = typeof team === 'string' ? team : team.slug
  return (
    <Link
      href={
        status === 'draft'
          ? `/new/configure/${project.id}`
          : `/${cloudSlug}/${teamSlug}/${project.slug}`
      }
      className={[className, classes.project].filter(Boolean).join(' ')}
    >
      <div className={classes.leader}>
        {status === 'draft' && <span className={classes.draft}>Draft</span>}
        {status !== 'draft' && project.plan && (
          <div className={classes.plan}>
            {typeof project.plan === 'object' && <Fragment>{project.plan.name}</Fragment>}
          </div>
        )}
      </div>
      <h6 className={classes.title}>{project.name}</h6>
      <div className={classes.details}>
        {repositoryFullName && (
          <div className={classes.projectRepo}>
            <GitHubIcon className={classes.githubIcon} />
            {repositoryFullName}
          </div>
        )}
        {deploymentBranch && (
          <div className={classes.projectBranch}>
            <BranchIcon className={classes.branchIcon} />
            {deploymentBranch}
          </div>
        )}
      </div>
      <ArrowIcon className={classes.arrowIcon} />
    </Link>
  )
}
