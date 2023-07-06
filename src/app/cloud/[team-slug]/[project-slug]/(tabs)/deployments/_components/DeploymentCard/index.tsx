import classes from './index.module.scss'

import { CommitIcon } from '@root/graphics/CommitIcon'
import { BranchIcon } from '@root/graphics/BranchIcon'
import { ArrowIcon } from '@root/icons/ArrowIcon'

import { Cell } from '@faceless-ui/css-grid'

export const DeploymentCard = () => {
  return (
    <div className={classes.deploymentCard}>
      <span className={classes.deploymentCard__date}>February 27rd, 2023, 3:54pm</span>
      <div className={classes.deploymentCard__commit}>
        <div className={classes.deploymentCard__branch}>
          <BranchIcon />
          main
        </div>
        <div className={classes.deploymentCard__hash}>
          <CommitIcon />
          179350f
        </div>
        <span className={classes.deploymentCard__message}>chore: commit message</span>
      </div>
      <div className={[classes.deploymentCard__status, classes.success].filter(Boolean).join(' ')}>
        <div></div>
        Success
      </div>
      <a href="#" className={classes.deploymentCard__viewLogs}>
        View Logs <ArrowIcon />
      </a>
    </div>
  )
}
