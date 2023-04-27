'use client'

import * as React from 'react'

import { RichText } from '@components/RichText'
import type { TopBar as TopBarType } from '../../payload-types'

import classes from './index.module.scss'

export const TopBar: React.FC<TopBarType> = ({ starText, announcement }) => {
  const [starCount, setStarCount] = React.useState(0)

  React.useEffect(() => {
    async function getStarCount() {
      const { stargazers_count: totalStars } = await fetch(
        'https://api.github.com/repos/payloadcms/payload',
      ).then(res => res.json())
      setStarCount(totalStars)
    }

    getStarCount()
  }, [])

  return (
    <div className={classes.topBar}>
      {starCount && (
        <div className={classes.wrap}>
          <div className={classes.starWrap}>
            <span>&#11088;</span>
            <strong className={classes.starCount}>{starCount.toLocaleString()} stars</strong>
            <span>&#8212;</span>
            <RichText className={classes.richText} content={starText?.desktop} />
            <RichText className={classes.mobileText} content={starText?.mobile} />
          </div>
          {announcement && (
            <div>
              <RichText className={classes.richText} content={announcement?.content} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
