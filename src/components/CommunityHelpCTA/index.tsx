import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import Link from 'next/link'
import React from 'react'

import classes from './index.module.scss'

export const CommunityHelpCTA: React.FC = () => {
  return (
    <Link
      aria-label="Browse community help"
      className={classes.cta}
      href="/community-help"
      prefetch={false}
    >
      <div className={classes.communityHelps}>
        <h5>Can&apos;t find what you&apos;re looking for?</h5>
        <ArrowIcon className={classes.arrow} />
        <p className={classes.license}>
          <span className={classes.button}>Browse community help&nbsp;</span>
        </p>
      </div>
    </Link>
  )
}
