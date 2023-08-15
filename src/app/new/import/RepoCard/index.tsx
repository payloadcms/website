import React from 'react'

import { Button } from '@components/Button'
import { LineDraw } from '@components/LineDraw'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { Repo } from '../useGetRepos'

import classes from './index.module.scss'

export const RepoCard: React.FC<{
  repo: Repo
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  isLoading?: boolean
  isHovered?: boolean
  onClick?: (repo: Repo) => void
}> = props => {
  const { repo, onMouseEnter, onMouseLeave, isLoading, isHovered, onClick } = props
  const { name, description } = repo || {}

  return (
    <div className={classes.repoCard} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className={classes.repo}>
        <div className={classes.repoContent}>
          <h6 className={classes.repoName}>{name}</h6>
          {description && <p className={classes.repoDescription}>{description}</p>}
        </div>
        {!isLoading && (
          <Button
            label="Import"
            appearance="primary"
            className={classes.importButton}
            onClick={() => {
              if (typeof onClick === 'function') {
                onClick(repo)
              }
            }}
          />
        )}
        {isLoading && <LoadingShimmer heightPercent={100} className={classes.shimmer} />}
      </div>
      <div className={classes.line}>
        <LineDraw align="bottom" active={isHovered} disabled={isLoading} />
      </div>
    </div>
  )
}
