import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { ArrowIcon } from '@icons/ArrowIcon/index'
import React from 'react'

import type { RoadmapCardProps } from '../types'

import classes from './index.module.scss'

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ item, showPriorityBadge = false }) => {
  const { commentCount, description, priority, title, upvoteCount, url } = item

  // Strip HTML tags for preview (GitHub returns HTML)
  const plainDescription = description.replace(/<[^>]*>/g, '').substring(0, 150)

  return (
    <a className={classes.card} href={url} rel="noopener noreferrer" target="_blank">
      <div className={classes.header}>
        {showPriorityBadge && (
          <span className={[classes.badge, classes[`badge--${priority.toLowerCase()}`]].join(' ')}>
            {priority}
          </span>
        )}
        <ArrowIcon className={classes.icon} />
      </div>

      <div className={classes.content}>
        <h4 className={classes.title}>{title}</h4>
        <p className={classes.description}>{plainDescription}...</p>
      </div>

      <div className={classes.meta}>
        <span className={classes.metaItem}>
          <svg
            className={classes.metaIcon}
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.75 2C3.33579 2 3 2.33579 3 2.75V12.25C3 12.6642 3.33579 13 3.75 13H12.25C12.6642 13 13 12.6642 13 12.25V2.75C13 2.33579 12.6642 2 12.25 2H3.75ZM4.5 3.5H11.5V11.5H4.5V3.5ZM6 5.25C6 5.66421 6.33579 6 6.75 6H9.25C9.66421 6 10 5.66421 10 5.25C10 4.83579 9.66421 4.5 9.25 4.5H6.75C6.33579 4.5 6 4.83579 6 5.25ZM6.75 7.5C6.33579 7.5 6 7.83579 6 8.25C6 8.66421 6.33579 9 6.75 9H9.25C9.66421 9 10 8.66421 10 8.25C10 7.83579 9.66421 7.5 9.25 7.5H6.75Z"
              fill="currentColor"
            />
          </svg>
          {commentCount}
        </span>
        <span className={classes.metaItem}>
          <svg
            className={classes.metaIcon}
            fill="none"
            height="16"
            viewBox="0 0 16 16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2L9.5 6H13.5L10.5 8.5L11.5 13L8 10L4.5 13L5.5 8.5L2.5 6H6.5L8 2Z"
              fill="currentColor"
            />
          </svg>
          {upvoteCount}
        </span>
      </div>

      <BackgroundScanline className={classes.scanlines} />
    </a>
  )
}
