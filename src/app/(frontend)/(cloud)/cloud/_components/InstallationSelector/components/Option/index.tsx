import { GitHubIcon } from '@root/graphics/GitHub/index'
import { components } from 'react-select'

import classes from './index.module.scss'

export const Option: React.FC<any> = (props) => {
  return (
    <components.Option {...props}>
      <div className={classes.option}>
        <div className={classes.githubIcon}>
          <GitHubIcon />
        </div>
        <div className={classes.optionLabel}>{props.label}</div>
      </div>
    </components.Option>
  )
}
