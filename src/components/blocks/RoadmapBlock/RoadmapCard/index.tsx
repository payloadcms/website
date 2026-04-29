import { ArrowIcon } from '@icons/ArrowIcon/index'
import React from 'react'

import type { RoadmapCardProps } from '../types'

import classes from './index.module.scss'

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ item, showPriorityBadge = false }) => {
  const { description, priority, title, url } = item

  const plainDescription = description.replace(/<[^>]*>/g, '').substring(0, 150)

  return (
    <a className={classes.card} href={url} rel="noopener noreferrer" target="_blank">
      <ArrowIcon className={classes.icon} />

      {showPriorityBadge && (
        <span className={[classes.badge, classes[`badge--${priority.toLowerCase()}`]].join(' ')}>
          {priority}
        </span>
      )}

      <h4 className={classes.title}>{title}</h4>
      <p className={classes.description}>{plainDescription}...</p>

    </a>
  )
}
