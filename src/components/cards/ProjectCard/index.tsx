import React, { Fragment } from 'react'
import Link from 'next/link'

import { cloudSlug } from '@root/app/cloud/client_layout'
import { GitHubIcon } from '@root/graphics/GitHub'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { BranchIcon } from '@root/icons/BranchIcon'
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
      href={`/${cloudSlug}/${teamSlug}/${project.slug}${status === 'draft' ? '/configure' : ''}`}
      className={[className, classes.project].filter(Boolean).join(' ')}
    >
      <div className={classes.leader}>
        {status === 'draft' && <span className={classes.draft}>Draft</span>}
        {status !== 'draft' && project.plan && (
          <div className={classes.plan}>
            {typeof project.plan === 'object' && project.plan !== null && (
              <Fragment>{project.plan.name}</Fragment>
            )}
          </div>
        )}
      </div>
      <h6 className={classes.title}>{project.name}</h6>
      <div className={classes.details}>
        {repositoryFullName && (
          <div className={classes.projectRepo}>
            <GitHubIcon className={classes.githubIcon} />
            <p>{repositoryFullName}</p>
          </div>
        )}
        {deploymentBranch && (
          <div className={classes.projectBranch}>
            <div className={classes.branchIcon}>
              <BranchIcon size="full" />
            </div>
            <p>{deploymentBranch}</p>
          </div>
        )}
      </div>
      <ArrowIcon className={classes.arrowIcon} />
    </Link>
  )
}
