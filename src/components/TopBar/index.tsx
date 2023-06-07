'use client'

import * as React from 'react'
import { useModal } from '@faceless-ui/modal'

import { modalSlug } from '@components/Header/MobileNav'
import { RichText } from '@components/RichText'
import { useStarCount } from '@root/utilities/use-star-count'
import type { TopBar as TopBarType } from '../../payload-types'

import classes from './index.module.scss'

export const TopBar: React.FC<TopBarType> = ({ starText, announcement }) => {
  const { isModalOpen } = useModal()
  const isMobileNavOpen = isModalOpen(modalSlug)
  const starCount = useStarCount()

  return (
    <div
      className={[classes.topBar, isMobileNavOpen && classes.mobileNavOpen]
        .filter(Boolean)
        .join(' ')}
    >
      {typeof starCount === 'string' && (
        <div className={classes.wrap}>
          <div className={classes.starWrap}>
            <span className={classes.star}>&#11088;</span>
            <span className={classes.starCount}>{starCount}</span>
            <span>&#8212;</span>
            <RichText className={classes.richText} content={starText?.desktop} />
            <RichText className={classes.mobileText} content={starText?.mobile} />
          </div>
          {announcement && (
            <div>
              <RichText
                className={classes.richText}
                content={typeof announcement === 'string' ? announcement : announcement?.content}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
