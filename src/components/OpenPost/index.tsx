import React from 'react'
import { useTheme } from '@providers/Theme'
import { ArrowIcon } from '@root/icons/ArrowIcon'

import classes from './index.module.scss'

const OpenPost: React.FC<{ url: string; platform: 'GitHub' | 'Discord' }> = ({ url, platform }) => {
  const theme = useTheme()

  return (
    <a className={classes[`next--${theme}`]} href={url} rel="noopener noreferrer" target="_blank">
      <div className={classes.nextLabel}>
        Open the post <ArrowIcon />
      </div>
      <h5>Continue the discussion in {platform}</h5>
    </a>
  )
}

export default OpenPost
