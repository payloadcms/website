import { Grid } from '@faceless-ui/css-grid'
import { DeploymentCard } from '../DeploymentCard'
import classes from './index.module.scss'

export const DeploymentList = () => {
  return (
    <div className={classes.deploymentList}>
      <DeploymentCard />
      <DeploymentCard />
      <DeploymentCard />
    </div>
  )
}
