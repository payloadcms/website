import React from 'react'

import { ArrowIcon } from '@root/icons/ArrowIcon'

import classes from './index.module.scss'

const OpenPost: React.FC<{ url: string; platform: 'GitHub' | 'Discord' }> = ({ url, platform }) => {
  return (
    <a className={classes.next} href={url} rel="noopener noreferrer" target="_blank">
      <div className={classes.nextLabel}>
        Open the post <ArrowIcon />
      </div>
      <h5>Continue the discussion in {platform}</h5>
    </a>
  )
}

export default OpenPost
