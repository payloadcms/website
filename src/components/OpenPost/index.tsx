import React from 'react'

import { BackgroundScanline } from '@components/BackgroundScanline/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'

import classes from './index.module.scss'

const OpenPost: React.FC<{ url: string; platform: 'GitHub' | 'Discord' }> = ({ url, platform }) => {
  return (
    <a className={classes.next} href={url} rel="noopener noreferrer" target="_blank">
      <BackgroundScanline className={classes.crosshairs} crosshairs="all" />
      <div className={classes.nextLabel}>
        Open <ArrowIcon />
      </div>
      <h3>Continue the discussion in {platform}</h3>
    </a>
  )
}

export default OpenPost
