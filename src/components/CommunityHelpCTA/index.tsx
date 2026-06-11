import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import Link from 'next/link'
import React from 'react'

import classes from './index.module.scss'

const discordURL = 'https://discord.gg/FSn5QRdsbC'

export const CommunityHelpCTA: React.FC = () => {
  return (
    <Link aria-label="Community Helps" className={classes.cta} href={discordURL} target="_blank">
      <div className={classes.communityHelps}>
        <h5>Can&apos;t find what you&apos;re looking for?</h5>
        <p className={classes.license}>
          <Link className={classes.button} href="/talk-to-us" prefetch={false}>
            Browse communtiy help&nbsp;
            <ArrowIcon className={classes.arrow} />
          </Link>
        </p>
      </div>
    </Link>
  )
}
