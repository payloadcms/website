import type { Repo } from '@cloud/_api/fetchRepos.js'

import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { LoadingShimmer } from '@components/LoadingShimmer/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import React from 'react'

import classes from './index.module.scss'

export const RepoCard: React.FC<{
  isHovered?: boolean
  isLoading?: boolean
  onClick?: (repo: Repo) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  repo: Repo
}> = (props) => {
  const { isLoading, onClick, onMouseEnter, onMouseLeave, repo } = props
  const { name, description } = repo || {}

  return (
    <button
      className={classes.repoCard}
      onClick={() => {
        if (typeof onClick === 'function') {
          onClick(repo)
        }
      }}
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
    </button>
  )
}
