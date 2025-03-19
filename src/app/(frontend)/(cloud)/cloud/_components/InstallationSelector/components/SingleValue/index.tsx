import { GithubIcon } from '@root/graphics/GithubIcon/index'
import { components } from 'react-select'

import classes from './index.module.scss'

export const SingleValue: React.FC<any> = (props) => {
  return (
    <components.SingleValue {...props}>
      <div className={classes.option}>
        <div className={classes.githubIcon}>
          <GithubIcon />
        </div>
        <div className={classes.optionLabel}>{props.children}</div>
      </div>
    </components.SingleValue>
  )
}
