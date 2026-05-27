import type { Repo } from '@cloud/_api/fetchRepos'

import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { LoadingShimmer } from '@components/LoadingShimmer/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import React from 'react'

import classes from './index.module.scss'

export const RepoCard: React.FC<{
  isHovered?: boolean
  isLoading?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  repo: Repo
}> = (props) => {
  const { isLoading, onMouseEnter, onMouseLeave, repo } = props
  const { name, description } = repo || {}

  return (
    <div
      className={classes.repoCard}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {!isLoading && (
        <>
          <div className={classes.repoContent}>
            <h5 className={classes.repoName}>{name}</h5>
            {description && <p className={classes.repoDescription}>{description}</p>}
          </div>
          <BackgroundScanline className={classes.scanlines} />
          <ArrowIcon className={classes.arrow} />
        </>
      )}
      {isLoading && <LoadingShimmer className={classes.shimmer} heightPercent={100} />}
    </div>
  )
}
